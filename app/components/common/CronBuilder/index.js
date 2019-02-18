import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';
import DatePicker from "react-datepicker";
import moment from 'moment';
import { actions as formActions, Form } from 'react-redux-form';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import cronParser from 'cron-parser';
import { notify } from 'react-notify-toast';
import FormGroups from '../FormGroups/index';
import FormButtons from '../FormButtons/index';
import { classroomFormDatePeriod, classroomFormDateBasic, classroomFormDateAdvance, classroomFormDateUnlimit } from '../../../constants/formsData';
import { If, Then } from 'react-if'

import { TOAST_TIMING } from '../../../constants';

const Comp = styled.div`
  width: 520px;
  color: #000;
`;

const TabContainer = styled.div`
    min-height: 200px;
`

const Header = styled.section`
  height: 40px;
  padding: 0px 20px;
  line-height: 40px;
  background-color: #000;
`;

const Background = styled.div`
  background-color: #f8f4f4;
  text-align: left;
  padding: 20px 20px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  background-color: #fff;
  margin-bottom: 15px;
`;

const Button = styled.button`
  padding: 5px 15px;
  opacity: 0.8;
  outline: none;
  cursor: pointer;


  &:hover { opacity: 1; }
  &:active{
    opacity: 0.8;
    transform: translateY(4px);
    outline: none;
  }
`

const Crons = styled.h5`
  line-height: 40px;
`

const CronTag = styled.span`
  background-color: #D2EBEB;
  padding: 5px 5px;
  margin-right:5px;
  border-radius: 5px;
`
const Info = styled.div`
  width: 200px;
  margin-bottom: 20px;
  color: #000;
  padding-left: 10px;
  border-left: 4px solid #48d2a0;
  text-align: left;
  overflow: hidden;
`


class CronBuilder extends React.Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      tabMode: 0
    };
  }

  componentWillUnmount() {
    this.resetCronFormat();
  }

  selectTab = (tabMode) => {
    this.setState({
      tabMode
    })

    this.resetCronFormat();

  }

  generateCronFormat = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { tabMode } = this.state;
    const { forms } = this.props;

    // Stage I ================

    // 先抓到起迄時間
    const startDateStr = moment(_.get(forms, 'classroomCron.startDate', '')).format('YYYY / MM / DD')
    const endDateStr = moment(_.get(forms, 'classroomCron.endDate', '')).format('YYYY / MM / DD')

    // 把 '固定期間每週開課' 格式算出來
    const periodAdvance = _.get(forms, 'classroomCron.periodAdvance', []);
    const periodWeekAdvanceObj = {
        description: periodAdvance
        .map(datum => `${_.get(datum,'label', '')}`)
        .join(' ') || '尚無資料',
        cron: periodAdvance
        .map(datum => `${_.get(datum,'value', '')}`)
        .join(',') || '*'
      }

    // 先暫時生成 week 的格式
    const calendarCronObj = {
      '0': {
        descripition: `${_.get(forms, 'classroomCron.periodBasic.label', '')}時間`,
        cron: `0 0 8 * * ${_.get(forms, 'classroomCron.periodBasic.value', '*')}`
      },
      '1': {
        descripition: `固定每週 ${periodWeekAdvanceObj.description}`,
        cron: `0 0 8 * * ${periodWeekAdvanceObj.cron}`
      },
      '2': {
        descripition: `區間內 不限時間`,
        cron: '* * * * * *'
      }
    }
    const selectedCron = calendarCronObj[`${tabMode}`];

    // 塞入 語意式 cron 敘述
    this.props.changeValue(tabMode !== 2 ? `${startDateStr} 至 ${endDateStr} 的 ${selectedCron.descripition}` : '完全不限時間', 'scheduleDescription', 'classroom');


    // 先生成 timeArr
    const rawTimeArr = [];
    const resultTimeArr = [];
    if (selectedCron.cron !== '* * * * * *') {
       // parse cron format
      const {
        startDate,
        endDate
      } = forms.classroomCron

      const startDataForCron = new Date(startDate).setDate(new Date(startDate).getDate() - 1)
      const endDateForCron = new Date(endDate);

      try {
        var interval = cronParser.parseExpression(
          selectedCron.cron,
          {
            currentDate: startDataForCron,
            endDate: endDateForCron,
            iterator: true
          }
        );
        while (true) {
          try {
            var obj = interval.next();
            const timeStr = obj.value.toString();
            rawTimeArr.push({
              rawTime: timeStr,
              moment: moment(timeStr).format('L'),
              month: moment(timeStr).month() + 1,
              dateInt: moment(timeStr).date(),
              date: moment(timeStr).format('YYYY-MM-DD'),
              rowDate: moment(timeStr)
            });
            // console.log('value:', moment(obj.value.toString()).format('L'), 'done:', obj.done);
          } catch (e) {
            break;
          }
        }
      } catch (err) {
        console.error('Time Error: ' + err.message);
      }
    }

    // 批次產生教室時間的格式
    rawTimeArr.forEach((current, index) => {
      // 先列出 current 跟 previous
      const previous = rawTimeArr[index - 1];

      // 比對決定是否塞入 resultArr
      if (index === 0 || current.dateInt - previous.dateInt > 1 || current.month - previous.month === 1) {
        resultTimeArr.push({
          startMonth: current.month,
          startDateInt: current.dateInt,
          startDate: current.date,
          rawStartDate: current.rowDate,
          length: 1
        })
      } else {
        resultTimeArr[resultTimeArr.length - 1].length += 1;
      }
    })

    // 批次加入 endDate
    const resultArr = resultTimeArr.map((result, index) => {
      const endMargin = result.startDateInt + result.length;
      const endDateInt = endMargin - 1;
      return ({
        ...result,
        endDateInt,
        endDate: result.rawStartDate.add(result.length - 1, 'days').format('YYYY-MM-DD'),
        cronDate: result.startDateInt === endDateInt ? `${result.startDateInt}` :`${result.startDateInt}-${endDateInt}`
      })
    })


    // Stage II =================
    // 把結果按照月份分開
    const monthObj = _.groupBy(resultArr, 'startMonth');

    // 再轉成最後 cron 格式
    let cronArr = _.map(monthObj, (array, index) => {
      return {
        cronMonth: `${_.get(array, '0.startMonth')}`,
        cronDate: array.map((datum) => datum.cronDate).join(",")
      }
    }).map(d => `* * ${d.cronDate} ${d.cronMonth} * *`);

    if (cronArr.length === 0) {
      cronArr = ['* * * * * *']
    }


    // 生成 calendar 用的 array
    const calendarArr = resultArr.map(d => _.pick(d, _.keys({
      startMonth: null,
      startDate: null,
      endDate: null,
      length: null,
    })))

    // 塞入 redux state
    this.props.changeValue(calendarArr, 'calendar', 'classroom');
    this.props.changeValue(cronArr, 'schedules', 'classroom');

    // console.log('cron all in one', rawTimeArr, resultArr, monthObj, cronArr, calendarArr);
  }

  resetCronFormat = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.props.resetForm('classroomCron');
    this.props.changeValue([], 'schedules', 'classroom');
  }

  render() {

    const {
      forms,
      config,
      isReset,
      changeValue
    } = this.props;

    return (
      <Comp>
        <Background>

          <Info>
            <h5>請注意</h5>
            <p>選定日期 & 週期後</p>
            <p>需按下 "產生時間格式" 輸出結果。</p>
          </Info>

          {/* 時間選擇 */}
          <div>
            <FormGroups
              formData={classroomFormDatePeriod}
              targetForm={forms.classroomCron}
              changeVal={changeValue}
            />
          </div>

          {/* 週期選擇 */}
          <TabContainer>
            <Tabs onSelect={this.selectTab}>
                <TabList>
                    <Tab>單次一日至連續多日課程</Tab>
                    <Tab>固定期間每週開課</Tab>
                    <Tab>不限時間</Tab>
                </TabList>
                <TabPanel>

                  <FormGroups
                    formData={classroomFormDateBasic}
                    targetForm={forms.classroomCron}
                    changeVal={changeValue}
                  />
                </TabPanel>
                <TabPanel>
                  <FormGroups
                    formData={classroomFormDateAdvance}
                    targetForm={forms.classroomCron}
                    changeVal={changeValue}
                  />
                </TabPanel>
                <TabPanel>
                  <FormGroups
                    formData={classroomFormDateUnlimit}
                    targetForm={forms.classroomCron}
                    changeVal={changeValue}
                  />
                </TabPanel>
            </Tabs>

            <If condition={!_.isEmpty(_.get(forms, 'classroom.schedules.0', ""))}>
              <Then>
                <h4>時間週期結果</h4>
                <Crons>{_.get(forms, 'classroom.scheduleDescription', '')}</Crons>
              </Then>
            </If>

            <FormButtons
              resetName="重置"
              submitName="產生時間格式"
              resetMethod={this.resetCronFormat}
              nextMethod={this.generateCronFormat}
              showMode="submit_reset"
              isForm={false}
            />
          </TabContainer>
        </Background>
      </Comp>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  resetForm: (formName) => dispatch(formActions.reset(
    `forms.${formName}`
  )),
  changeValue: (value, key, formName) => dispatch(formActions.change(
    `forms.${formName}.${key}`,
    value
  )),
  changeForm: (formObj, formName) => dispatch(formActions.change(
    `forms.${formName}`,
    formObj
  ))
});

const mapStateToProps = ({ forms }) => ({
  forms
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CronBuilder);
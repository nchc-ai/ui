import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';
import DatePicker from "react-datepicker";
import moment from 'moment';
import Select from 'react-select';
import { actions as formActions, Form } from 'react-redux-form';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import cronParser from 'cron-parser';
import { notify } from 'components/common/NotifyToast';
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

const Background = styled.div`
  background-color: #f8f4f4;
  text-align: left;
  padding: 20px 20px;
`;

const FormGroups = styled.div`
  min-height: 40px;
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

const OptionLabel = styled.label`
padding-left: 10px;
`

const OptionText = styled.span`

  display: inline-block;
  padding-left: 10px;
  transform: translateY(2px);
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


class CronInputs extends React.Component {

  state = {
    tabIndex: 0,
    tabFirst: {
      label: '每日',
      value: '*'
    },
    tabSecond: [],
    tabThird: {
      label: '不限時間',
      value: '不限時間'
    }
  }

  componentWillMount () {
    window.scrollTo(0, 0);
    // 先回復資料
    console.log('this.props', this.props.targetForm);

    // 先按照資訊調到對應的

  }

  componentWillUnmount() {
    this.resetCronFormat();
  }

  selectTab = (tabIndex) => {
    this.setState({
      tabIndex
    })
    // this.props.changeValue(tabMode, 'selectedType', 'classroom.schedule');
    this.resetCronFormat();
  }

  generateCronFormat = (e) => {
    if (e) {
      e.preventDefault();
    }

    const {
      targetForm,
      changeValue
    } = this.props;

    // Stage I ================


    const selectedType = _.get(targetForm, 'selectedType', 0);
    // 先抓到起迄時間
    const startDateStr = moment(_.get(targetForm, 'startDate', '')).format('YYYY / MM / DD')
    const endDateStr = moment(_.get(targetForm, 'endDate', '')).format('YYYY / MM / DD')

    // console.log('selectedType', selectedType, startDateStr, endDateStr, targetForm);

    // 把 [TAB 2] '固定期間每週開課' 格式算出來
    // const periodAdvance = _.get(targetForm, 'schedule.periodAdvance', []);
    // const periodWeekAdvanceObj = {
    //     description: periodAdvance
    //     .map(datum => `${_.get(datum,'label', '')}`)
    //     .join(' ') || '尚無資料',
    //     cron: periodAdvance
    //     .map(datum => `${_.get(datum,'value', '')}`)
    //     .join(',') || '*'
    //   }

    // 先暫時生成 week 的格式
    const calendarCronObj = {
      '0': {
        description: `${_.get(targetForm, 'selectedOption.0.label', '')}時間`,
        cron: `0 0 8 * * ${_.get(targetForm, 'selectedOption.0.value', '*')}`
      },
      '1': {
        description: `固定每週 ${_.get(targetForm, 'selectedOption.0.label', '')}`,
        cron: `0 0 8 * * ${_.get(targetForm, 'selectedOption.0.value', '')}`
      },
      '2': {
        description: `區間內 不限時間`,
        cron: '* * * * * *'
      }
    }
    const selectedCron = calendarCronObj[`${selectedType}`];
    // console.log('selectedCron', selectedCron);
    // 塞入 語意式 cron 敘述
    this.props.changeValue(selectedType !== 2 ? `${startDateStr} 至 ${endDateStr} 的 ${selectedCron.description}` : '完全不限時間', 'description', 'classroom.schedule');


    // 先生成 timeArr
    const rawTimeArr = [];
    const resultTimeArr = [];
    if (selectedCron.cron !== '* * * * * *') {
       // parse cron format
      const {
        startDate,
        endDate
      } = targetForm

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
    const resultArr = resultTimeArr.map((result) => {
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
    changeValue(calendarArr, 'calendar', 'classroom');
    changeValue(cronArr, 'cronFormat', 'classroom.schedule');

  }

  resetCronFormat = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.props.resetForm('classroom.schedule');
  }

  render() {

    const {
      targetForm,
      template,
      changeValue
    } = this.props;


    let {
      tabFirst,
      tabSecond,
      tabThird
    } = this.state;

    // let selectedIndex = _.get(targetForm, 'schedule.selectedType', 0);
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
            <FormGroups className="form-group">
              <label className="required-label label">
                <span className="main-label">開始時間： </span>
              </label>
              <DatePicker
                className="text-input"
                selected={new Date(_.get(targetForm, `startDate`))}
                onChange={val => changeValue(val, template.inputFirst.name, template.inputFirst.target)}
                dateFormat="yyyy / MM / dd"
              />
            </FormGroups>
            <FormGroups className="form-group">
              <label className="required-label label">
                <span className="main-label">結束時間： </span>
              </label>
              <DatePicker
                className="text-input"
                selected={new Date(_.get(targetForm, `endDate`))}
                onChange={val => changeValue(val, template.inputSecond.name, template.inputSecond.target)}
                dateFormat="yyyy / MM / dd"
              />
            </FormGroups>
          </div>

          {/* 週期選擇 */}
          <TabContainer>
            <Tabs selectedIndex={this.state.tabIndex}  onSelect={this.selectTab}>
                <TabList>
                    <Tab>單次一日至連續多日課程</Tab>
                    <Tab>固定期間每週開課</Tab>
                    <Tab>不限時間</Tab>
                </TabList>
                {/* 1. 單次一日至連續多日課程 */}
                <TabPanel>
                  <div className="form-input-radio">
                    {
                      template.tabFirst.options.map(opt => (
                        <div key={opt.key} className={`radio-input-con ${template.className}`}>
                          <OptionLabel
                            htmlFor={`radio-input-${opt.radioKey}`}
                            className="radio-label"
                          >
                            <input
                              id={`radio-input-${opt.radioKey}`}
                              type="radio"
                              className="radio-input"
                              value={opt.value}
                              checked={ opt.value === tabFirst.value}
                              onChange={() => changeValue(opt, 'selectedOption.0', template.tabFirst.target)}
                            />
                            <OptionText>{opt.label}</OptionText>
                          </OptionLabel>
                        </div>
                      ))
                    }
                  </div>
                </TabPanel>
                {/* 2. 固定期間每週開課 */}
                <TabPanel>
                  <div className="form-input">
                    <Select
                      name="form-field-name"
                      value={_.get(targetForm, template.tabSecond.name, [])}
                      placeholder={template.tabSecond.placeholder}
                      onChange={val => changeValue(val, template.tabSecond.name, template.tabSecond.target)}
                      options={template.tabSecond.options || []}
                      multi
                    />
                  </div>
                </TabPanel>
                {/* 3. 不限時間 */}
                <TabPanel>
                  {
                    template.tabThird.options.map(opt => (
                      <div key={opt.key} className={`radio-input-con ${template.className}`}>
                        <OptionLabel
                          htmlFor={`radio-input-${opt.radioKey}`}
                          className="radio-label"
                        >
                          <input
                            id={`radio-input-${opt.radioKey}`}
                            type="radio"
                            className="radio-input"
                            value={opt.value}
                            checked={opt.value === tabThird.value}
                            onChange={() => changeValue(opt, 'selectedOption.0', template.tabThird.target)}
                          />
                          <OptionText>{opt.label}</OptionText>
                        </OptionLabel>
                      </div>
                    ))
                  }
                </TabPanel>
            </Tabs>

            {/* <If condition={!_.isEmpty(_.get(targetForm, 'cronFormat.0', ""))}> */}
              {/* <Then> */}
                <hr />
                <h4>時間週期結果</h4>
                <Crons>{_.get(targetForm, 'description') || '👇 尚無資料，請點選按鈕產生'}</Crons>
              {/* </Then> */}
            {/* </If> */}

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

export default CronInputs;
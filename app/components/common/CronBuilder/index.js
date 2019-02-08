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
import { classroomFormDatePeriod, classroomFormDateBasic, classroomFormDateAdvance } from '../../../constants/formsData';
import { If, Then, Else, When, Unless } from 'react-if'

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

const Info = styled.div`
  width: 200px;
  margin-bottom: 20px;
  color: #000;
  padding-left: 10px;
  border-left: 4px solid #48d2a0;
  text-align: left;
  overflow: hidden;

`

const Container = styled.div`
  width: 100%;
  max-height: 320px;
  overflow: hidden;
  overflow-y: scroll;
  display: inline-block;

  ::-webkit-scrollbar {display:none}
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  background-color: #fff;
  margin-bottom: 15px;
`;

const RowActive = styled(Row)`
  box-shadow: 2px 2px 7px 0 rgba(0, 0, 0, 0.21);
`;


const RowItem = styled.span`
  padding-left: 20px;
`;

const Input = styled.input`
  padding-left: 6px;
  border: 1px solid #979797;
  background-color: #fff;
  outline: none;
`;

const Label = styled.label`
  margin-bottom: 0px;
  color: #000;
  font-size: 14px;
`;

const LabelText = styled.span`
  font-size: 14px;
  padding-right: 10px;
`;

const Delete = styled.div`
  width: 20px;
  padding-left: 10px;
`;


const ButtonsGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Reset = styled.div`
  justify-self: flex-start;
`;

const Add = styled.div`
  justify-self: flex-end;
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

const AddButton = styled(Button)`
  background-color: #000;
  border-radius: 5px;
  color: #fff;
`;

const DeleteButton = styled(Button)`
  padding: 5px 5px;
`;


const Crons = styled.h5`
  line-height: 40px;
`

const CronTag = styled.span`
  background-color: #D2EBEB;
  padding: 5px 5px;
  margin-right:5px;
  border-radius: 5px;
`

class CronBuilder extends React.Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      selectMode: 0
    };
  }

  componentWillUnmount() {
    this.resetCronFormat();
  }

  selectTab = (selectMode) => {
    this.setState({
      selectMode
    })

    this.resetCronFormat();

  }

  generateCronFormat = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { selectMode } = this.state;
    const {
      forms
    } = this.props;

    // 階段 1
    // 先把 week 格式算出來
    const periodAdvance = _.get(forms, 'classroomCron.periodAdvance', []);
    let periodWeekAdvance = "*";

    if (periodAdvance.length > 0) {
      periodWeekAdvance = periodAdvance.map(datum => `${_.get(datum,'value', '')}`).join(',');
    }

    // 先暫時生成 week 的格式
    const week = selectMode === 0 ?
        _.get(forms, 'classroomCron.periodBasic.value', '*')
      :
        periodWeekAdvance;

    // 先生成 timeArr

    const rawTimeArr = [];
    const resultTimeArr = [];

    // start cron parse

    let limit = 0;
    const {
      startDate,
      endDate
    } = forms.classroomCron
    try {
      var interval = cronParser.parseExpression(
        `0 0 8 * * ${week}`,
        {
          currentDate: new Date(startDate),
          endDate: new Date(endDate),
          iterator: true
        }
      );
      while (true) {
        try {

          limit = limit + 1;
          var obj = interval.next();
          const timeStr = obj.value.toString();
          rawTimeArr.push({
            rawTime: timeStr,
            moment: moment(timeStr).format('L'),
            month: moment(timeStr).month() + 1,
            date: moment(timeStr).date()
          });
          console.log('value:', moment(obj.value.toString()).format('L'), 'done:', obj.done);
        } catch (e) {
          break;
        }
      }
    } catch (err) {
      console.log('Error: ' + err.message);
    }

    console.log('rawTimeArr', rawTimeArr);

    // 產生 for 教室時間的格式
    rawTimeArr.forEach((current, index) => {
      // 先列出 current 跟 previous
      const previous = rawTimeArr[index - 1];

      // 比對決定是否塞入 resultArr
      if (index === 0 || current.date - previous.date > 1 || current.month - previous.month === 1) {
        resultTimeArr.push({
          startMonth: current.month,
          startDate: current.date,
          length: 1
        })
      } else {
        resultTimeArr[resultTimeArr.length - 1].length += 1;
      }
    })

    // 批次加入 endDate
    const resultArr = resultTimeArr.map((result, index) => {
      const endMargin = result.startDate + result.length;
      const endDate = endMargin - 1;
      return ({
        ...result,
        endDate,
        cronDate: result.startDate === endDate ? `${result.startDate}` :`${result.startDate}-${endDate}`
      })
    })

    // 把結果塞入
    const monthObj = _.groupBy(resultArr, 'startMonth');

    // 再轉成最後 cron 格式

    const cronElementArr = _.map(monthObj, (array, index) => {
      return {
        cronMonth: `${_.get(array, '0.startMonth')}`,
        cronDate: array.map((datum) => datum.cronDate).join(",")
      }
    })

    const cronArr = cronElementArr.map(d => `* * ${d.cronDate} ${d.cronMonth} * *`);



    // result
    console.log('resultArr', resultArr, monthObj, cronElementArr,  cronArr);

    this.props.changeValue(cronArr, 'schedules', 'classroom');




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
            </Tabs>

            <If condition={!_.isEmpty(_.get(forms, 'classroom.schedules.0', ""))}>
              <Then>
                <h4>時間週期結果</h4>
                <Crons>{_.get(forms, 'classroom.schedules', []).map(d => (
                  <CronTag> {d} </CronTag>
                ))}</Crons>
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
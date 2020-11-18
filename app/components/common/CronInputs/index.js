import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import DatePicker from "react-datepicker";
import moment from 'moment';
import Select from 'react-select';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import cronParser from 'cron-parser';
import { notify } from 'components/common/NotifyToast';
import FormButtons from '../FormButtons/index';
import { classroomFormDatePeriod, classroomFormDateBasic, classroomFormDateAdvance, classroomFormDateUnlimit } from '../../../constants/formsData';



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
  color: ${props => props.length > 0 ? '#373838' : '#fa7564'};
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

const initialState = {
  tabIndex: 0,
  tabData: [
    {
      label: '每日',
      value: '*'
    },
    [],
    {
      label: '不限時間',
      value: '不限時間'
    }
  ],
  startDate: new Date(moment().format('YYYY-MM-DD')),
  endDate: new Date(moment().add(2, 'months').format('YYYY-MM-DD'))
}
class CronInputs extends React.Component {

  state = initialState;

  componentWillMount () {
    window.scrollTo(0, 0);
    this.updatePeriod(this.props.targetForm)
  }

  componentWillUnmount() {
    this.resetCronFormat();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.targetForm !== this.props.targetForm) {
      this.updatePeriod(nextProps.targetForm)
    }
  }

  selectTab = (tabIndex) => {
    this.setState({
      tabIndex
    });
  }

  selectTime = ({ type, val }) => {
    if ( type === 'startDate') {
      this.setState({ startDate: val })
    } else {
      this.setState({ endDate: val })
    }
    // this.generateCronFormat();
  }

  selectValue = ({ selectedType, selectedOption }) => {
    // console.log('selectValue', selectedType, selectedOption);
    this.setState(state => {
      const tabData = state.tabData.map((d, i) => i === selectedType ? selectedOption : d);
      return {
        tabIndex: selectedType,
        tabData
      };
    });
  }

  updatePeriod = (targetForm) => {
    const startDate = new Date(targetForm.startDate);
    const endDate = new Date(targetForm.endDate);
    const { selectedType } = targetForm;
    const selectedOption = selectedType === 1 ? targetForm.selectedOption : targetForm.selectedOption[0];
    // console.log('targetForm', targetForm);
    this.setState({ startDate, endDate });
    this.selectValue({ selectedType, selectedOption });
  }

  generateCronFormat = (e) => {
    if (e) { e.preventDefault(); }

    const {
      targetForm,
      changeValue
    } = this.props;

    let {
      tabIndex,
      tabData,
      startDate,
      endDate
    } = this.state

    if (moment(startDate) > moment(endDate)) {
      notify.show('請確認 "結束時間" 是否在 "起始時間" 之後', 'error', 3000);
      return;
    }

    if (tabIndex === 1 && tabData[tabIndex].length === 0) {
      notify.show('請確認是否填妥 "固定期間每週開課" 欄位', 'error', 3000);
      return;
    }

    const startDateStr = moment(startDate).format('YYYY / MM / DD')
    const endDateStr = moment(endDate).format('YYYY / MM / DD')

    const calendarCronObj = {
      '0': {
        description: `${tabData[0].label}時間`,
        cron: `0 0 8 * * ${tabData[0].value}`
      },
      '1': {
        description: `固定每週 ${tabData[1].map(d => d.label).join(',')}`,
        cron: `0 0 8 * * ${tabData[1].map(d => d.value).join(',')}`
      },
      '2': {
        description: `完全不限時間`,
        cron: '* * * * * *'
      }
    }
    const selectedCron = calendarCronObj[`${tabIndex}`];
    const description = tabIndex !== 2 ? `${startDateStr} 至 ${endDateStr} 的 ${selectedCron.description}` : selectedCron.description;

    const rawTimeArr = [];
    const resultTimeArr = [];
    if (selectedCron.cron !== '* * * * * *') {
      const {
        startDate,
        endDate
      } = this.state;

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
              year: moment(timeStr).year(),
              dateInt: moment(timeStr).date(),
              date: moment(timeStr).format('YYYY-MM-DD'),
              rowDate: moment(timeStr)
            });
          } catch (e) {
            break;
          }
        }
      } catch (err) {
        console.error('Time Error: ' + err.message);
      }
    }

    rawTimeArr.forEach((current, index) => {
      const previous = rawTimeArr[index - 1];
      if (index === 0 || current.dateInt - previous.dateInt > 1 || current.month - previous.month === 1 || current.year - previous.year === 1) {
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

    const monthObj = _.groupBy(resultArr, 'startMonth');
    let cronFormat = _.map(monthObj, (array, index) => {
      return {
        cronMonth: `${_.get(array, '0.startMonth')}`,
        cronDate: array.map((datum) => datum.cronDate).join(",")
      }
    }).map(d => `* * ${d.cronDate} ${d.cronMonth} * *`);

    if (cronFormat.length === 0) {
      cronFormat = ['* * * * * *']
    }

    const calendarArr = resultArr.map(d => _.pick(d, _.keys({
      startMonth: null,
      startDate: null,
      endDate: null,
      length: null,
    })))
    // console.log('tabData[tabIndex]', tabData[tabIndex]);
    const secheduleObj = {
      cronFormat,
      description,
      startDate,
      endDate,
      selectedType: tabIndex,
      selectedOption: tabIndex === 1 ? tabData[tabIndex] : [tabData[tabIndex]]
    }

    changeValue(secheduleObj, 'schedule', 'classroom');
    changeValue(calendarArr, 'calendar', 'classroom');

    notify.show('已成功產生時間格式', 'success', 2000);
  }

  resetCronFormat = (e) => {
    if (e) { e.preventDefault(); }
    this.setState(initialState);
    this.props.resetForm('classroom.schedule');
  }

  render() {
    const {
      targetForm,
      template,
      changeValue
    } = this.props;

    let {
      tabIndex,
      tabData,
      startDate,
      endDate
    } = this.state;
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
                selected={startDate}
                onChange={val => this.selectTime({ type: 'startDate', val })}
                dateFormat="yyyy / MM / dd"
              />
            </FormGroups>
            <FormGroups className="form-group">
              <label className="required-label label">
                <span className="main-label">結束時間： </span>
              </label>
              <DatePicker
                className="text-input"
                selected={endDate}
                onChange={val => this.selectTime({ type: 'endDate', val })}
                dateFormat="yyyy / MM / dd"
              />
            </FormGroups>
          </div>

          {/* 週期選擇 */}
          <TabContainer>
            <Tabs selectedIndex={tabIndex}  onSelect={this.selectTab}>
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
                              checked={ opt.value === tabData[0].value}
                              onChange={() => this.selectValue({ selectedType: 0, selectedOption: opt })}
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
                      value={tabData[1]}
                      placeholder={template.tabSecond.placeholder}
                      onChange={val => this.selectValue({ selectedType: 1, selectedOption: val })}
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
                            checked={opt.value === tabData[2].value}
                            onChange={() => this.selectValue({ selectedType: 2, selectedOption: opt })}
                          />
                          <OptionText>{opt.label}</OptionText>
                        </OptionLabel>
                      </div>
                    ))
                  }
                </TabPanel>
            </Tabs>

            <hr />
            <h4>時間週期結果</h4>
            <Crons length={_.get(targetForm, 'description').length}>
              {_.get(targetForm, 'description') || '👇 尚無資料，請點選按鈕產生'}
            </Crons>

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
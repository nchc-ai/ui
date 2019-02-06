import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';
import DatePicker from "react-datepicker";
import { actions as formActions, Form } from 'react-redux-form';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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

    const periodAdvance = _.get(forms, 'classroomCron.periodAdvance', []);
    let periodWeekAdvance = "*";

    if (periodAdvance.length > 0) {
      periodWeekAdvance = periodAdvance.map(datum => `${_.get(datum,'value', '')}`).join(',');
    }

    const week = selectMode === 0 ?
        _.get(forms, 'classroomCron.periodBasic.value', '*')
      :
        periodWeekAdvance;
    const result = `0 8 * * ${week} *`;
    this.props.changeValue([result], 'schedules', 'classroom');
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
                    <Tab>基本週期</Tab>
                    <Tab>自訂週期</Tab>
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
                <h5>{_.get(forms, 'classroom.schedules.0', "")}</h5>
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
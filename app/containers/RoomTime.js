import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import EventCalendar from '../components/common/EventCalendar/index';
import bindActionCreatorHOC from '../libraries/bindActionCreatorHOC';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Popover from 'react-bootstrap/lib/Popover';
import Overlay from 'react-bootstrap/lib/Overlay';
import Modal from 'react-bootstrap/lib/Modal';
import CalendarData from '../components/common/EventCalendar/calendarData';
import SectionTitle from '../components/common/SectionTitle';
import TitleIcon from '../assets/images/user/title-icon.png';
import CommonPageContent from '../components/CommonPageContent'

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class RoomTime extends Component {

  constructor(props) {
    super(props);

    this.state = {
      moment: moment(),
      showPopover: false,
      showModal: false,
      overlayTitle: null,
      overlayContent: null,
      popoverTarget: null,
    };

    this.handleNextMonth = this.handleNextMonth.bind(this);
    this.handlePreviousMonth = this.handlePreviousMonth.bind(this);
    this.handleToday = this.handleToday.bind(this);
    this.handleEventClick = this.handleEventClick.bind(this);
    this.handleEventMouseOver = this.handleEventMouseOver.bind(this);
    this.handleEventMouseOut = this.handleEventMouseOut.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    this.fetchData(this.props);
    moment.locale('zh-tw');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.url !== this.props.match.url) {
      window.scrollTo(0, 0);
      this.fetchData(nextProps);
    }
  }

  fetchData = (nextProps) => {
    const {
      roomAction,
      userInfo,
      token
    } = nextProps;

    roomAction.getPublicClassrooms({
      token
    });
  }

  handleNextMonth() {
    this.setState({
        moment: this.state.moment.add(1, 'M'),
    });
  }

  handlePreviousMonth() {
    this.setState({
        moment: this.state.moment.subtract(1, 'M'),
    });
  }

  handleToday() {
    this.setState({
        moment: moment(),
    });
  }

  handleEventMouseOver(target, eventData, day) {
    this.setState({
      showPopover: true,
      popoverTarget: () => ReactDOM.findDOMNode(target),
          overlayTitle: eventData.title,
          overlayContent: eventData.description,
    });
  }

  handleEventMouseOut(target, eventData, day) {
    this.setState({
        showPopover: false,
    });
  }

  handleEventClick(target, eventData, day) {
    // console.log('show');
    this.setState({
      showPopover: false,
      showModal: true,
      overlayTitle: eventData.title,
      overlayContent: eventData.description,
    });
  }

  handleDayClick(target, day) {
    this.setState({
      showPopover: false,
      showModal: true,
      overlayTitle: this.getMomentFromDay(day).format('Do of MMMM YYYY'),
      overlayContent: 'User clicked day (but not event node).',
    });
  }

  getMomentFromDay(day) {
    return moment().set({
      'year': day.year,
      'month': (day.month + 0) % 12,
      'date': day.day
    });
  }

  handleModalClose() {
    this.setState({
      showModal: false,
    })
  }

  getHumanDate() {
    return [moment.months('MM', this.state.moment.month()), this.state.moment.year()].join(' ');
  }

  render() {

    const {
      Calendar
    } = this.props;

    return (
      <CommonPageContent
          className="room-time-bg"
          pageTitle="教室時間"
      >
        <Overlay
            show={this.state.showPopover}
            rootClose
            onHide = {()=>this.setState({showPopover: false })}
            placement="top"
            container={this}
            target={this.state.popoverTarget}>
            <Popover id="event">{this.state.overlayTitle}</Popover>
        </Overlay>

        <Modal show={this.state.showModal} onHide={this.handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>{this.state.overlayTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {this.state.overlayContent}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.handleModalClose}>Close</Button>
            </Modal.Footer>
        </Modal>

        <Grid>
            <Row>
                <Col xs={6}>
                    <ButtonToolbar>
                        <Button onClick={this.handlePreviousMonth}>&lt;</Button>
                        <Button onClick={this.handleNextMonth}>&gt;</Button>
                        <Button onClick={this.handleToday}>今天</Button>
                    </ButtonToolbar>
                </Col>
                <Col xs={6}>
                    <div className="pull-right h2">{this.getHumanDate()}</div>
                </Col>
            </Row>
            <br />
            <Row>
                <Col xs={12}>
                    <EventCalendar
                        month={this.state.moment.month()}
                        year={this.state.moment.year()}
                        events={Calendar.data || []}
                        onEventClick={this.handleEventClick}
                        onEventMouseOver={this.handleEventMouseOver}
                        onEventMouseOut={this.handleEventMouseOut}
                        onDayClick={this.handleDayClick}
                        maxEventSlots={10}
                    />
                </Col>
            </Row>
        </Grid>

      </CommonPageContent>
    );
  }
}

const mapStateToProps = ({ Auth, Course, Classroom }) => ({
  token: Auth.token,
  userInfo: Auth.userInfo,
  Calendar: {
    isLoading: Classroom.calendar.isLoading,
    data: Classroom.calendar.data
  }
});

const mapDispatchToProps = dispatch => ({

});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHOC,
)(RoomTime);

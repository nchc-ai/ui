import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import SideMenu from '../components/SideMenu/index';
import TableList from '../components/common/TableList/index';
import { userCourseList } from '../constants/fakeData';
import { userCourseData } from '../constants/tableData';
import { getToken } from '../libraries/utils';

class UserPage extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    const token = getToken();
    console.log('token', token);
    this.props.userAction.getCourseList('jimmy', token);    
  }
  render() {
    const {
      match
    } = this.props;
    return (
      <div id="page-wrap" className="user-bg global-content">
       
        <div className="side-menu-wrap fl">
          <SideMenu
            match={match}
          />
        </div>
        <div className="fl user-container">
          <Switch>
            {/* 課程列表 */}
            <Route exact path="/user/course">
              <div className="user-course-bg">
                <Row>
                  <Col>課程列表</Col>
                  <Col>
                    <Link to="/user/course/add"><button>+ 新增 </button></Link>
                  </Col>
                </Row>
                <TableList
                  data={userCourseList}
                  tableData={userCourseData}
                />

              </div>
            </Route>
            
            <Route exact path="/user/course/add">
              <div className="user-course-edit-bg">
                {/* TODO: FormGroups */}

              </div>
            </Route>

          </Switch>
        </div>
        
      </div>
    );
  }
}

const mapStateToProps = ({  }) => ({
});

export default compose(
  connect(mapStateToProps),
  bindActionCreatorHoc
)(UserPage);

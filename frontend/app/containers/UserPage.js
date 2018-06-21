import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { Row, Col } from 'reactstrap';
import SideMenu from '../components/SideMenu/index';
import TableList from '../components/common/TableList/index';
import { userCourseList } from '../constants/fakeData';
import { userCourseData } from '../constants/tableData';

class UserPage extends Component {
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
                    <button>+ 新增 </button>
                  </Col>
                </Row>
                <TableList
                  data={userCourseList}
                  tableData={userCourseData}
                />

              </div>
            </Route>
            
          </Switch>
        </div>
        
      </div>
    );
  }
}

export default UserPage;

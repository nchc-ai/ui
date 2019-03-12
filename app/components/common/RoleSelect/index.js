import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import bindActionCreatorHOC from '../../../libraries/bindActionCreatorHOC';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FaKey, FaChalkboardTeacher, FaUserGraduate }  from 'react-icons/fa';
import { userInfo } from 'os';
class RoleSelect extends Component {
  state = {
    dropdownOpen: false
  }

  toggle = () => {
    const prevState = { ...this.state };
    this.setState({
      dropdownOpen: !prevState.dropdownOpen
    });
  }

  closeSubstituating = () => {
    const {
      roleAction
    } = this.props;

    roleAction.toggleSubstituating(false);
  }

  render() {
    const {
      isSubstituating,
      userInfo
    } = this.props;
    return (
      <div className="role-select-comp">
        {
          isSubstituating ?
          <Link to="/user/classroom-manage/list">
            <button className="btn-common" onClick={this.closeSubstituating}>切換回 {userInfo.username}</button>
          </Link>
          :
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              視角切換
            </DropdownToggle>
            <DropdownMenu>
              {/* 老師 */}
              <Link to="/user/role-select/teacher" className="dropdown-link">
                <DropdownItem>
                  <FaChalkboardTeacher />
                  <span>老師</span>
                </DropdownItem>
              </Link>
              {/* 學生 */}
              <Link to="/user/role-select/student" className="dropdown-link">
                  <DropdownItem>
                      <FaUserGraduate />
                      <span>學生</span>
                  </DropdownItem>
              </Link>
            </DropdownMenu>
          </Dropdown>
        }
      </div>
    );
  }
}

const mapStateToProps = ({ Auth, Role }) => ({
  userInfo: Auth.userInfo,
  isSubstituating: Role.isSubstituating,
});

export default compose(
  connect(mapStateToProps),
  bindActionCreatorHOC,
)(RoleSelect);
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import bindActionCreatorHoc from '../../../libraries/bindActionCreatorHoc';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FaKey, FaChalkboardTeacher, FaUserGraduate }  from 'react-icons/fa';
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
      authAction
    } = this.props;

    authAction.toggleSubstituating(false);
  }

  render() {
    const {
      isSubstituating
    } = this.props;
    return (
      <div className="role-select-comp">
        {
          isSubstituating ?
          <Link to="/user/classroom-manage/list">
            <button onClick={this.closeSubstituating}>取消切換</button>
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

const mapStateToProps = ({ Auth }) => ({
  isSubstituating: Auth.substituation.isSubstituating,
});

export default compose(
  connect(mapStateToProps),
  bindActionCreatorHoc,
)(RoleSelect);
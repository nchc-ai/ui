import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FaKey, FaChalkboardTeacher, FaUserGraduate }  from 'react-icons/fa';

export default class RoleSelect extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="role-select-comp">
        <DropdownToggle caret>
          視角切換
        </DropdownToggle>
        <DropdownMenu>
          <Link to="/user/role-select/admin" className="dropdown-link">
            <DropdownItem>
              <FaKey />
              <span>管理員</span>
            </DropdownItem>
          </Link>

          <Link to="/user/role-select/teacher" className="dropdown-link">
            <DropdownItem>
              <FaChalkboardTeacher />
              <span>老師</span>
            </DropdownItem>
          </Link>

          <Link to="/user/role-select/student" className="dropdown-link">
              <DropdownItem>
                  <FaUserGraduate />
                  <span>學生</span>
              </DropdownItem>
          </Link>
        </DropdownMenu>
      </Dropdown>
    );
  }
}
import React from 'react';
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
          <DropdownItem><FaKey />管理員</DropdownItem>
          <DropdownItem><FaChalkboardTeacher />老師</DropdownItem>
          <DropdownItem><FaUserGraduate />學生</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}
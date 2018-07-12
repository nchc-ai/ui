import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Form, Control } from 'react-redux-form';
import bindActionCreatorHoc from '../../libraries/bindActionCreatorHoc';
import searchBtnIcon from '../../../public/images/header/search-icon.png';

class GlobalSearch extends React.Component {
  static propTypes = {
  }

  onSubmit = (query) => {
    const {
      history
    } = this.props;
    history.push(`/course/search/${query.searchText}`);
  }

  render = () => {
    return (
      <Form
        className="global-search-comp"
        model="forms.globalSearch"
        onSubmit={this.onSubmit}
      >
        <Control.text
          type="text"
          className="global-search"
          model="forms.globalSearch.searchText"
          placeholder="Search"
        />
        <button
          type="submit"
          className="global-search-btn"
        >
          <img alt="" src={searchBtnIcon} />
        </button>
      </Form>
    );
  }

}

const mapStateToProps = ({ Auth }) => ({
  userInfo: Auth.userInfo,
  isLogin: Auth.isLogin
});

export default compose(
  connect(mapStateToProps),
  bindActionCreatorHoc,
)(withRouter(GlobalSearch));

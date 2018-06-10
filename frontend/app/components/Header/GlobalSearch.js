import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Form, Control } from 'react-redux-form';
import bindActionCreatorHoc from '../../libraries/bindActionCreatorHoc';
// import searchBtnIcon from '../../images/common/header-search-m.png';

class GlobalSearch extends React.Component {
  static propTypes = {
  }

  onSubmit = (query) => {
    const {
      history
    } = this.props;
    history.push(`/search/${query.searchText}`);
  }

  render = () => {
    return (
      <Form
        model="forms.globalSearch"
        onSubmit={this.onSubmit}
      >
        <Control.text
          type="text"
          className="global-search"
          model="forms.globalSearch.searchText"
          placeholder="搜尋KNOMO商品"
        />
        <button
          type="submit"
          className="global-search-btn"
        >
          {/* <img alt="" src={searchBtnIcon} /> */}
        </button>
      </Form>
    );
  }

}

const mapStateToProps = ({ Auth }) => ({
  userInfo: Auth.userInfo,
  isLogin: Auth.isLogin,
  cartSum: 0
});

export default compose(
  connect(mapStateToProps),
  bindActionCreatorHoc,
)(withRouter(GlobalSearch));

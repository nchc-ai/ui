import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { actions as formActions, Form, Control } from 'react-redux-form';
import bindActionCreatorHOC from '../../libraries/bindActionCreatorHOC';
import searchBtnIcon from '../../../public/images/header/search-icon.png';

class GlobalSearch extends React.Component {
  static propTypes = {
  }

  onSubmit = (query) => {
    const {
      history,
      resetForm
    } = this.props;
    history.push(`/search/${query.searchText}`);
    resetForm('globalSearch');
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
          placeholder="搜尋課程"
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

const mapDispatchToProps = dispatch => ({
  resetForm: (formName) => dispatch(formActions.reset(
    `forms.${formName}`
  ))
});

const mapStateToProps = ({ Auth }) => ({
  userInfo: Auth.userInfo,
  isLogin: Auth.isLogin
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHOC,
)(withRouter(GlobalSearch));

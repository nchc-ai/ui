import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PopupWindow from './PopWindow';
import { toQuery } from '../../libraries/utils';
import { WEBSITE_URL, AUTH_PROVIDER_URL, RETURN_ROUTE } from '../../config/api';

class MyoauthButton extends Component {
  static propTypes = {
    buttonText: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    onRequest: PropTypes.func,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
  }

  static defaultProps = {
    buttonText: '登入 / 註冊',
    scope: 'user:email',
    onRequest: () => {},
    onSuccess: () => {},
    onFailure: () => {}
  }

  onBtnClick = () => {
    const REDIRECT_URI = `${WEBSITE_URL}${RETURN_ROUTE}`
    const search = toQuery({
      client_id: 'test_client_1',
      scope: 'read_write',
      redirect_uri: encodeURI(REDIRECT_URI),
    });
    const popup = this.popup = PopupWindow.open(
      'github-oauth-authorize',
      `${AUTH_PROVIDER_URL}/web/authorize?response_type=code&${search}`,
      { height: 1000, width: 600 }
    );

    this.onRequest();
    popup.then(
      data => this.onAuthSuccess(data),
      error => this.onFailure(error)
    );
  }

  onRequest = () => {
    this.props.onRequest();
  }

  onAuthSuccess = (data) => {
    if (!data.code) {
      return this.onFailure(new Error('\'code\' not found'));
    }

    this.props.onSuccess(data);
  }

  onFailure = (error) => {
    this.props.onFailure(error);
  }

  render() {
    const { className, buttonText, children } = this.props;
    const attrs = { onClick: this.onBtnClick };

    if (className) {
      attrs.className = className;
    }

    return <button {...attrs}>{ children || buttonText }</button>;
  }
}

export default MyoauthButton;

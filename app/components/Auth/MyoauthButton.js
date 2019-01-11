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
    buttonText: 'Sign in with GitHub',
    scope: 'user:email',
    onRequest: () => {},
    onSuccess: () => {},
    onFailure: () => {}
  }

  onBtnClick = () => {
    const queryString = toQuery({
      client_id: 'test_client_1',
      scope: 'read_write',
      login_redirect_uri: '/web/authorize',
      redirect_uri: `${WEBSITE_URL}${RETURN_ROUTE}`,
    });
    const popup = this.popup = PopupWindow.open(
      'github-oauth-authorize',
      `${AUTH_PROVIDER_URL}/web/authorize?response_type=code&${queryString}`,
      { height: 1000, width: 600 }
    );

    this.onRequest();
    popup.then(
      data => this.onSuccess(data),
      error => this.onFailure(error)
    );
  }

  onRequest = () => {
    this.props.onRequest();
  }

  onSuccess = (data) => {
    console.log('data', data);
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

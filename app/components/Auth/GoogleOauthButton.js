import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PopupWindow from './PopWindow';
import { toQuery } from '../../libraries/utils';
import { WEBSITE_URL, AUTH_PROVIDER_URL, RETURN_ROUTE } from '../../config/api';

class GoogleOauthButton extends Component {
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
      redirect_uri: encodeURI(REDIRECT_URI),
    });  
    const popup = this.popup = PopupWindow.open(
      'google-oauth-authorize',
      `https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=294126750314-kilf7lm39n919kj1gss11nj1pph58iu2.apps.googleusercontent.com&include_granted_scopes=true&prompt=consent&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&state=random&${search}`,
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

export default GoogleOauthButton;

import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import MyoauthButton from './MyoauthButton';
import { WEBSITE_URL } from '../../config/api';
import SectionTitle from '../common/SectionTitle/index';
import logoImg from '../../../public/images/auth/login-logo.png';
import localBtnImg from '../../../public/images/auth/login-btn-ailab.png';
import githubBtnImg from '../../../public/images/auth/login-btn-github.png';


const Login = ({ match, onSuccess, onFailure }) => (
  <div className="login-comp">
    <SectionTitle
      isTitleImg
      titleImgUrl={logoImg}
      subTitle={'歡迎來到NCHC.ai'}
    />
    <div className="line-h" />

    <div className="btn-container">
      <MyoauthButton
        onSuccess={onSuccess}
        onFailure={onFailure}
      >
        <img alt="" src={localBtnImg} />
      </MyoauthButton>
      <h4>OR</h4>

      <Link to="/signup">
        <button className="btn-signup btn-grp">
          立即註冊
        </button>
      </Link>

      <p className="policy-word">By continuing, you agree to NCHC.ai’s Terms of Service, Privacy Policy</p>
    </div>

    {/* <div className="line-h" />

    <div className="signup-door-link">
      <span>請由此註冊您的帳號</span>
      <Link to="/signup">馬上加入</Link>
    </div> */}

  </div>
);

export default Login;

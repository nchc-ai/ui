import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import SectionTitle from '../common/SectionTitle/index';
import logoImg from '../../../public/images/auth/login-logo.png';
import localBtnImg from '../../../public/images/auth/login-btn-ailab.png';
import githubBtnImg from '../../../public/images/auth/login-btn-github.png';


const Login = ({ match }) => (
  <div className="login-comp">
    <SectionTitle
      isTitleImg
      titleImgUrl={logoImg}
      subTitle={'歡迎來到NCHC.ai'}
    />
    <div className="line-h" />

    <div className="btn-container">
      <button className="btn-login-local btn-grp">
        <img alt="" src={localBtnImg} />
      </button>
      <h4>OR</h4>
      <button className="btn-login-github btn-grp">
        <img alt="" src={githubBtnImg} />
      </button>

      <p className="policy-word">By continuing, you agree to NCHC.ai’s Terms of Service, Privacy Policy</p>
    </div>
    

    

    <div className="line-h" />

    <div className="signup-door-link">
      <span>請由此註冊您的帳號</span>
      <Link to="/signup">馬上加入</Link>
    </div>

  </div>
);

export default Login;

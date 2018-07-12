import React from 'react';
// import GlobalSearch from './GlobalSearch';
// import { welcomeWords } from '../../libraries/utils';

const TopBar = ({ userInfo, isLogin, offline }) => (
  <div className="top-bar-comp">
    <a
      className="top-bar-left-link"
      href="/"
      target="_blank"
      rel="noopener noreferrer"
    >
      #AI_LAB
    </a>

    <ul className="top-bar-links">
      {/* { offline ? null : <GlobalSearch /> } */}
    </ul>
    {/* { isLogin ? <span className="greeting-word">{welcomeWords(userInfo)}</span> : null } */}
  </div>
);

export default TopBar;

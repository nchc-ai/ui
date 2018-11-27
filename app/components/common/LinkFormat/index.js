import React from 'react';
import { Link } from 'react-router-dom';
// 判斷offline > 判斷isLink > 判斷isMain
const LinkFormat = ({ textObj, isMain, offline, offlineWarning, onClick }) => (
  <Link to={textObj.url} className={`link-format-${textObj.isLink ? 'comp' : 'disable'}`}>
    <span className={isMain ? 'title' : 'info'}>{textObj.text}</span>

    {/* {
      offline ?
        <div className="link-format-container">
          <span className="v-helper" />
          {
            textObj.isLink ?
              <Link to="#" className="link-text" offlineWarning={offlineWarning}>
                <p className={isMain ? 'title' : 'info'}>{textObj.text}</p>
              </Link>
            :
              <span className="link-text">
                <p className={isMain ? 'title' : 'info'} >{textObj.text}</p>
              </span>
          }
        </div>
      :
        <div className="link-format-container">
          <span className="v-helper" />
          {
            textObj.isLink ?
              <Link to={textObj.url} className="link-text" onClick={onClick}>
                <p className={isMain ? 'title' : 'info'} >{textObj.text}</p>
              </Link>
            :
              <span className="link-text" onClick={onClick}>
                <p className={isMain ? 'title' : 'info'} >{textObj.text}</p>
              </span>
          }
        </div>
    } */}
  </Link>
);

export default LinkFormat;

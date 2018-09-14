import React from 'react';

const HeaderBlock = ({ headerArr, children }) => (
  <div className="header-block-comp">
    <div className="header-block-header">
      {
        headerArr.map((d, i) => (
          <li
            key={i}
            className={`list-col-0${i + 1} list-col-0${i + 1}-header list-col-grp `}
          >{d}
          </li>
        ))
      }
    </div>

    <div className="header-block-content">
      {children}
    </div>
  </div>
);

export default HeaderBlock;

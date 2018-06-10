import React from 'react';
import { footerBottomLeftArr, footerBottomRightArr } from '../../constants/navData';
import LinkFormat from '../common/LinkFormat/index';

const FooterMid = ({ offline, offlineWarning }) => (
  <div className="bottom-part-bg">
    <div className="col-left col-grp">
      <ul className="bottom-part-ul">
        <span className="v-helper" />
        {
          footerBottomLeftArr.map((d, k) => (
            <li key={k}>
              <span className="devide-line-v" />
              <LinkFormat
                textObj={d}
                offline={offline}
                offlineWarning={offlineWarning}
              />
            </li>
          ))
        }
      </ul>
    </div>
    <div className="col-right col-grp">
      {
        footerBottomRightArr.map((d, l) => (
          <span key={l}>{d.text}</span>
        ))
      }
    </div>
  </div>
);

export default FooterMid;

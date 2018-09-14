import React from 'react';

import FooterTop from './FooterTop';
import FooterMid from './FooterMid';
import FooterBottom from './FooterBottom';

const Index = ({ offline, offlineWarning }) => (
  <div className="footer-bg">
    <FooterTop offline={offline} offlineWarning={offlineWarning} />

    <FooterMid offline={offline} offlineWarning={offlineWarning} />

    <FooterBottom offline={offline} offlineWarning={offlineWarning} />
  </div>
);

export default Index;

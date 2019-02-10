import React from 'react';
import SectionTitle from './common/SectionTitle';
import TitleIcon from '../assets/images/user/title-icon.png';


const CommonPageContent = ({ className, pageTitle, children }) => (
  <div className={`${className} global-content`}>
    <SectionTitle
      title={pageTitle}
      iconImgUrl={TitleIcon}
      isUnderline
      isIcon
      isFloatLeft
    />
    <div className="user-content">
      {children}
    </div>
  </div>
);

export default CommonPageContent;
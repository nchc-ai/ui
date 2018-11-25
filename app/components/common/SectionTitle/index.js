import React from 'react';

const Index = ({ title, subTitle, children, isUnderline, isTitleImg, isIcon, iconImgUrl, titleImgUrl, info }) => (
  <div className="common-title-con">
    {
      isIcon ? 
      <div className="fl">
        <img alt="" src={iconImgUrl} />
      </div>
      : null
    }
    <div className="fl">
      {
        isTitleImg ?
          <img alt="" src={titleImgUrl} />
        :
          <h1>{title}</h1>

      }
      {
        subTitle ?
        <h6>{subTitle}</h6>
        :
        null
      }
      
      {children}
      {
        isUnderline ? <div className="common-title-underline" /> : null
      }
      <p>{info}</p>
    </div>
   
  </div>
);

export default Index;

import React from 'react';

const Index = ({ title, subTitle, children, isUnderline, isTitleImg, titleImgUrl, info }) => (
  <div className="common-title-con">
    {
      isTitleImg ?
        <img alt="" src={titleImgUrl} />
      :
        <h1>{title}</h1>

    }
    <h6>{subTitle}</h6>
    {children}
    {
      isUnderline ? <div className="common-title-underline" /> : null
    }
    <p>{info}</p>
  </div>
);

export default Index;

import React from 'react';

const Index = ({ title, subTitle, children, isUnderline }) => (
  <div className="common-title-con">
    <h1>{title}</h1>
    <h6>{subTitle}</h6>
    {children}
    {
      isUnderline ? <div className="common-title-underline" /> : null
    }
  </div>
);

export default Index;

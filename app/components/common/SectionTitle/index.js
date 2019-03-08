import React from 'react';
import { If, Then, Else, When, Unless } from 'react-if'

const Index = ({ title, subTitle, children, isUnderline, isTitleImg, isIcon, iconImgUrl, titleImgUrl, isFloatLeft, info }) => (
  <div className="common-title-con">
    <If condition={!_.isUndefined(isIcon) && isIcon}>
      <Then>
        <div className={isFloatLeft ? "fl" : ""}>
          <img alt="" src={iconImgUrl} />
        </div>
      </Then>
    </If>

    <div className={isFloatLeft ? "fl" : ""}>
      <If condition={!_.isUndefined(isTitleImg) && isTitleImg}>
        <Then>
          <img alt="" src={titleImgUrl} />
        </Then>
        <Else>
          <h1>{title}</h1>
        </Else>
      </If>

      <If condition={!_.isUndefined(subTitle)}>
        <Then>
          <h6>{subTitle}</h6>
        </Then>
      </If>

      {children}

      <If condition={!_.isUndefined(isUnderline) && isUnderline}>
        <Then>
          <div className="common-title-underline" />
        </Then>
      </If>

      <p>{info}</p>

    </div>
  </div>
);

export default Index;

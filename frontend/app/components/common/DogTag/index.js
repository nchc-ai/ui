import React from 'react';
import Avatar from 'react-avatar';

const DogTag = ({ data }) => (
  <div className="dog-tag-comp">
    <div className="avatar-container con-grp fl">
      <span className="v-helper" />
      <Avatar size="36" name={data.username} src={data.imgUrl} round />
    </div>
    <div className="content-container con-grp fl">
      <h5>{data.username}</h5>
      <p>開課講師</p>
    </div>
  </div>
);

export default DogTag;

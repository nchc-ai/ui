import React from 'react';
import Avatar from 'react-avatar';

const DogTag = ({ data }) => (
  <div className="dog-tag-comp">
    <div className="avatar-container con-grp fl">
      <span className="v-helper" />
      <Avatar size="36" name={data.name} src={data.imgUrl} round />
    </div>
    <div className="content-container con-grp fl">
      <h5>{data.title}</h5>
      <p>{data.info}</p>
    </div>
  </div>
);

export default DogTag;

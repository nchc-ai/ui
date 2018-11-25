import React from 'react';
import Avatar from 'react-avatar';

const DogTag = ({ data, name }) => (
  <div className="dog-tag-comp">
    <div className="avatar-container con-grp fl">
      <span className="v-helper" />
      <Avatar size="36" name={data.username || 'A'} src={data.imgUrl} round />
    </div>
    <div className="content-container con-grp fl">
      <h5 className={data.username.length > 14 ? 'name-overflow' : 'name'}>{data.username || 'Adam Lin'}</h5>
      {/* <h5 className={name.length > 14 ? 'name' : 'name'}>{name}</h5> */}
      <p>{data.role === 'teacher' ? '開課教師' : '學生' }</p>
    </div>
  </div>
);

export default DogTag;

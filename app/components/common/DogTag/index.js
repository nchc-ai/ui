import React from 'react';
import Avatar from 'react-avatar';
import { ROLE_SUPERUSER, ROLE_TEACHER, ROLE_STUDENT } from '../../../constants';

const roleMapping = {
  superuser: '管理員',
  teacher: '開課老師',
  student: '學生'
}


const DogTag = ({ userInfo, name, isSubstituating }) => (
  <div className="dog-tag-comp">
    <div className="avatar-container con-grp fl">
      <span className="v-helper" />
      <Avatar size="36" name={userInfo.username || 'A'} src={userInfo.imgUrl} round />
    </div>
    <div className="content-container con-grp fl">
      <h5 className={userInfo.username.length > 14 ? 'name-overflow' : 'name'}>{ userInfo.cName || userInfo.username || 'Guest'}</h5>
      {/* <h5 className={name.length > 14 ? 'name' : 'name'}>{name}</h5> */}
      <p>{roleMapping[userInfo.role]}
        { isSubstituating ? <span className="substite-badge">切換中</span> : null }
      </p>
    </div>
  </div>
);

export default DogTag;

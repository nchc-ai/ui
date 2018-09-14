import React from 'react';
import courseBn from '../../../public/images/course/course-title-bn.png';
import courseSection01 from '../../../public/images/course/course-section-1.png';
import courseSection02 from '../../../public/images/course/course-section-2.png';
import courseSection03 from '../../../public/images/course/course-section-3.png';

const CourseIntro = () => (
  <div>
    <div className="section-01 section-grp">
      <img className="bg-grp" alt="" src={courseBn} />
    </div>
    <div className="section-02 section-grp">
      <img className="bg-grp" alt="" src={courseSection01} />
    </div>
    <div className="section-03 section-grp">
      <img className="bg-grp" alt="" src={courseSection02} />
    </div>
    <div className="section-04 section-grp">
      <img className="bg-grp" alt="" src={courseSection03} />
    </div>
  </div>
);

export default CourseIntro;

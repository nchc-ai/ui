import React from 'react';
import courseBn from '../../../public/images/course/course-title-bn.png';
import courseSection01 from '../../../public/images/course/course-section-1.png';
import courseSection02 from '../../../public/images/course/course-section-2.png';
import courseSection03 from '../../../public/images/course/course-section-3.png';

const Index = () => (
  <div>
    <div className="section-01">
      <img alt="" src={courseBn} />
    </div>
    <div className="section-02">
      <img alt="" src={courseSection01} />
    </div>
    <div className="section-03">
      <img alt="" src={courseSection02} />
    </div>
    <div className="section-04">
      <img alt="" src={courseSection03} />
    </div>
  </div>
);

export default Index;

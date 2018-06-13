import React from 'react';
import createReactClass from 'create-react-class';
import SectionTitle from '../components/common/SectionTitle/index';
import section01Title from '../../public/images/index/section01-title.png';
import section01Info from '../../public/images/index/section01-info.png';
import { indexPage } from '../constants/models';

const AppComponent = createReactClass({
  render() {
    return (
      <div className="index-bg global-content">
        <div className="section-01">
          <img alt="title" className="title" src={section01Title} />
          <img alt="info" className="info" src={section01Info} />
          {/* <span className="info">{indexPage.section01.info}</span>
           */}

          <div className="highlight">
            <span>
            AI教育為其中一項服務，以提升產業內人才技術為起點，進而達成協助產業AI技術落地的終極目標。
           </span>
          </div>
        </div>

        {/* <div className="section-02">
          <SectionTitle
            title="提升人才技術 創造企業新價值"
            subTitle="提升人才技術 創造企業新價值"
          />

        </div>


        <div className="section-03">
          <SectionTitle
            title="提升人才技術 創造企業新價值"
            subTitle="提升人才技術 創造企業新價值"
          />
        </div>


        <div className="section-04">
          <SectionTitle
            title="提升人才技術 創造企業新價值"
            subTitle="提升人才技術 創造企業新價值"
          />
        </div> */}


      </div>
    );
  }
});
module.exports = AppComponent;

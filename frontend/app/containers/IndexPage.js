import React, {Component} from 'react';
import createReactClass from 'create-react-class';
import { Row, Col } from 'reactstrap';
import Thumbnails from '../components/common/Thumbnails/index';
import SectionTitle from '../components/common/SectionTitle/index';
import section01Title from '../../public/images/index/section01-title.png';
import section01Info from '../../public/images/index/section01-info.png';
import section02Title from '../../public/images/index/section02-title.png';
import section03Title from '../../public/images/index/section03-title.png';
import section03Title02 from '../../public/images/index/section04-title.png';
import imgServer from '../../public/images/index/section03-img.png';
import imgTree from '../../public/images/index/section02-tree.png';
import imgTrain from '../../public/images/index/section02-train.png';
import * as models from '../constants/models';

class IndexPage extends Component {

  render() {
    return (
      <div className="index-bg global-content">
        <div className="section-01 section-grp">
          <img alt="title" className="title" src={section01Title} />
          <img alt="info" className="info" src={section01Info} />
          {/* <span className="info">{indexPage.section01.info}</span>
           */}

          <div className="highlight">
            <span> {models.indexPage.section01.highLight}</span>
          </div>
          <img className="img-tree img-grp" alt="train" src={imgTree} />
          <img className="img-train  img-grp" alt="train" src={imgTrain} />
        </div>

        <div className="section-02 section-grp">
          <SectionTitle
            isTitleImg
            titleImgUrl={section02Title}
            subTitle={models.indexPage.section02.subTitle}
          />
          

          <Thumbnails
            className="section-02-thumb"
            data={models.indexPage.section02.thumbs}
            col={3}
          />
          

        </div>


        <div className="section-03 section-grp">
          <SectionTitle
            isTitleImg
            titleImgUrl={section03Title}
          />
          
          <Row>
            <Col md={{ size: 6 }}>
              <img alt="intro-img" src={imgServer} />
            
            </Col>
            <Col md={{ size: 6 }}>
              <img alt="intro-img" src={imgServer} />
              <div className="devide-line" />
              <div className="content">
                {}
              </div>
            </Col>

          </Row>

          <SectionTitle
            isTitleImg
            titleImgUrl={section03Title02}
          />
          
          <Thumbnails
            data={models.indexPage.section04.thumbs}
            col={3}
          />


        </div>
      </div>
    );
  }
}

export default IndexPage;

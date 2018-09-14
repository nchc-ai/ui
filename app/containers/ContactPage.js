import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import imgServer from '../../public/images/index/section03-img.png';
import contactBn from '../../public/images/contact/contact-bn.png';
import imgTitle from '../../public/images/index/section03-title-logo.png';
import * as models from '../constants/models';

class ContactPage extends Component {
 
  componentWillMount() {
    
    // this.props.userAction.getCourseList('jimmy', token)
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="contact-bg global-content">
        <div className="section-bn section-grp">
          <img className="bg-grp" alt="" src={contactBn} />
        </div>
        <div className="section-01-bg">
          <Row className="section-01-container">
            {/* <Col md={{ size: 6 }}>
              <img className="intro-img" alt="intro-img" src={imgServer} />
            
            </Col> */}
            <Col md={{ size: 12 }}>
              <img alt="" className="intro-title-img" src={imgTitle} />
              <div className="line-h" />
              <div className="content">
                {
                  models.contactPage.info01.map(d => (
                    <p key={d.key}>{d.text}</p>
                  ))
                }
              </div>
              <div className="content">
                {
                  models.contactPage.info02.map(d => (
                    <p key={d.key}>{d.text}</p>
                  ))
                }
              </div>
            </Col>

          </Row>
        </div>

        
      </div>
    );
  }
}

export default ContactPage;

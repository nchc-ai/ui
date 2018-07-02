import React from 'react';
import { translate } from 'react-i18next';
import { Container, Jumbotron, Row, Col, Button } from 'reactstrap';


const CustomJumbotron = ({ data, t, children }) => (
  <div className="custom-jumbotron-comp">
    <Row>
      <Col>
        <p className="custom-jumbotron-tag">進階</p>
      </Col>
    </Row>
    <Row className="title-row">
      <Col>
        <h1 className="title-main">BigData</h1>
      </Col>
      <Col>
        <h5 className="title-side">開課講師：Serena</h5>
      </Col>
    </Row>
    {/* <p className="lead">This is a simple hero unit, a simple Jumbotron-style component for calling extra attention to featured content or information.</p> */}
    <hr className="my-2" />
    <div className="custom-jumbotron-info">
      {children}
    </div>
  </div>
);

export default CustomJumbotron;

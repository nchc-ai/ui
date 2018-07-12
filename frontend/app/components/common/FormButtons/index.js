import React from 'react';
import { Row, Col } from 'reactstrap';

const FormButtons = ({ cancelName, submitName, backMethod, submitMethod, resetMethod, isReset }) => (
  <div className="submit-bg">
    <Row className="form-buttons-container">
      <Col md={{ size: 2 }}>
        <button
          type="submit"
          className="next-btn btn-pair"
          onClick={submitMethod}
        >
          {submitName || '繼續'}
        </button>
      </Col>
      <Col md={{ size: 2 }}>
        <button
          className="back-btn btn-pair"
          onClick={backMethod}
        >
          {cancelName || '回上一步'}
        </button>
      </Col>
      <Col md={{ size: 2, offset: 6 }}>
        {
          isReset ?
            <button
              className="reset-btn btn-pair"
              onClick={resetMethod}
            >
              重置
            </button>
          : null
        }
      </Col>
    </Row>
  </div>
);

export default FormButtons;

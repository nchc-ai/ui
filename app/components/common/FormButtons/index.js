import React from 'react';
import { Row, Col } from 'reactstrap';

const FormButtons = ({ size, isForm, isSubmitOnly, cancelName, submitName, backMethod, nextMethod, resetMethod, isReset }) => (
  <div className="submit-bg">
    <Row className="form-buttons-container">
      <Col md={{ size: size || 2 }}>
        {
          isForm ?
            <button
              type="submit"
              className="next-btn btn-pair"
            >
              {submitName || '繼續'}
            </button>
          :
            <button
              type="submit"
              className="next-btn btn-pair"
              onClick={nextMethod}
            >
              {submitName || '繼續'}
            </button>
        }
      </Col>
      <Col md={{ size: size || 2 }} style={{ display: isSubmitOnly ? 'none' : "block" }}>
        <button
          className="back-btn btn-pair"
          onClick={backMethod}
        >
          {cancelName || '回上一步'}
        </button>
      </Col>
      <Col md={{ size: size || 2, offset: 6 }} style={{ display: isSubmitOnly ? "none" : 'block' }}>
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

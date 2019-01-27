import React from 'react';
import { Row, Col } from 'reactstrap';

const FormButtons = ({ size, isForm, showMode, cancelName, submitName, backMethod, nextMethod, resetMethod, isReset }) => (
  <div className="submit-bg">
    <Row className="form-buttons-container">

      {/* Next button */}
      {
        showMode === 'submit_only' || showMode === 'submit_back' ?
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
        : null
      }

      {/* Back button */}
      {
        showMode === 'back_only' || showMode === 'submit_back' ?
          <Col md={{ size: size || 2 }}>
            <button
              className="back-btn btn-pair"
              onClick={backMethod}
            >
              {cancelName || '回上一步'}
            </button>
          </Col>
        : null
      }


      {/* Reset button */}
      {
        showMode === 'reset_only' ?
          <Col md={{ size: size || 2, offset: 6 }}>
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
        : null
      }
    </Row>
  </div>
);

export default FormButtons;

import React from 'react';
import { Row, Col } from 'reactstrap';
import styled from 'styled-components';
import { If, Then, Else, When, Unless } from 'react-if'
import { ButtonLoader } from '../LoadButton/index';

const Component = styled.div`
  display: flex;
  flex-direction: row;
`;

const Button = styled.button`
  margin-right: 20px;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
  color: #fff;
  opacity: 0.8;
  outline: none;
  cursor: pointer;


  &:hover { opacity: 1; }
  &:active{
    opacity: 0.8;
    transform: translateY(4px);
    outline: none;
  }
`
const Next = styled(Button)`
  background-color: #2a9b9d;
`

const Back = styled(Button)`
  background-color: #fff;
  color: #9b9b9b;
  border: 1px solid #9b9b9b;
`

const Reset = styled(Button)`
  background-color: #DE576E;
`



const FormButtons = ({ size, isForm, showMode, cancelName, submitName, resetName, backMethod, nextMethod, resetMethod, isReset, isLoading }) => (
  <Component>
    {/* Next button */}
    <If condition={showMode === 'submit_only' || showMode === 'submit_back' || showMode === 'submit_reset'}>
      <Then>
        <If condition={isForm}>
          <Then>
            <ButtonLoader
              type="submit"
              loading={isLoading || false}
            >
              {submitName || '繼續'}
            </ButtonLoader>
          </Then>

          <Else>
            <ButtonLoader
              onClick={nextMethod}
              loading={isLoading || false}
            >
              {submitName || '繼續'}
            </ButtonLoader>
          </Else>
        </If>
      </Then>
    </If>

    {/* Back button */}
    <If condition={showMode === 'back_only' || showMode === 'submit_back'}>
      <Then>
        <Back
          onClick={backMethod}
        >
          {cancelName || '回上一步'}
        </Back>
      </Then>
    </If>

    {/* Reset button */}
    <If condition={showMode === 'reset_only' || showMode === 'submit_reset'}>
      <Then>
        <Reset
          onClick={resetMethod}
        >
          {resetName || '重置'}
        </Reset>
      </Then>
    </If>
  </Component>
);

export default FormButtons;

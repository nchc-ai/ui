import React from "react";
import { Browser } from 'react-kawaii';
import styled from 'styled-components';


const Comp = styled.div`
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  width: 200px;
  height: initial;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction:column;
  text-align: center;
  color:#9C9C9C;
`

const IconContainer = styled.div`
  padding-top: 20px;
  font-size: 45px;
`

const Word = styled.h5`
  line-height: 40px;
`



const NoData = ({ emptyWord }) => (
  <Comp>
    <Container>
      <IconContainer>
        <Browser size={50} mood="shocked" color="#61DDBC" />
      </IconContainer>
      <Word className="no-data-word">{emptyWord}</Word>
    </Container>
  </Comp>
);

export default NoData;

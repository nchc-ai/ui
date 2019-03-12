import React from "react";
import styled from 'styled-components';
import MDSpinner from 'react-md-spinner';

const Comp = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  display: inline-grid;
`;

const Container = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  padding-top: 30px;
  margin-left: auto;
  margin-right: auto;
`;


const Loading = () => (
  <Comp>
    <Container>
      <MDSpinner size={32} />
    </Container>
  </Comp>
);

export default Loading;

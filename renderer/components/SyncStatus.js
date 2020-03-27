import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  left: 15px;
  bottom: 15px;

  display: flex;
  flex-flow: column;

  box-sizing: border-box;
  width: 300px;
  padding: 15px;
  border-radius: 3px;

  background: rgb(0, 0, 0);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: rgb(240, 240, 240);
`;

const Label = styled.em`
  padding-right: 10px;
  font-style: normal;
  cursor: default;
`;

const ProgressContainer = styled.div`
  width: 100%;
  padding-top: 10px;
`;

const Progress = styled.div`
  width: ${(props) => (props.progress ? props.progress * 100 : 0)}%;
  min-width: 0px;
  max-width: 100%;
  height: 5px;
  border-radius: 3px;
  background: rgb(240, 240, 240);
  transition: width 125ms ease-in-out;
`;

const Spinner = () => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 50 50"
    style={{ width: 'auto', height: 16 }}
  >
    <path
      fill="currentColor"
      d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
    >
      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="rotate"
        from="0 25 25"
        to="360 25 25"
        dur="1s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);

export default function SyncStatus({ progress }) {
  return (
    <Container>
      <Title>
        <Label>Synchronization Progress</Label>
        <Spinner />
      </Title>
      <ProgressContainer>
        <Progress progress={progress} />
      </ProgressContainer>
    </Container>
  );
}

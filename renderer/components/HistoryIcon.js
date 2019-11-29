import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg`
  width: ${props => props.width || 30}px;
  height: auto;
  margin-right: ${props => props.marginRight || 0}px;
`;

export default function HistoryIcon({ width, marginRight }) {
  return (
    <Svg
      width={width}
      marginRight={marginRight}
      viewBox="0 0 87 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="50.5" r="10.5" fill="white" />
      <circle cx="54" cy="15.5" r="10.5" fill="white" />
      <circle cx="70" cy="69.5" r="10.5" fill="white" />
      <line
        x1="19.706"
        y1="50.2588"
        x2="52.7061"
        y2="16.2588"
        stroke="white"
        strokeWidth="5"
      />
      <line
        x1="69.08"
        y1="69.6274"
        x2="55.08"
        y2="15.6274"
        stroke="white"
        strokeWidth="5"
      />
      <path d="M14.5 47L5 6L20 45L14.5 47Z" fill="white" />
    </Svg>
  );
}

import styled from 'styled-components';
import { animated } from 'react-spring';
import { complementaryPrimary } from '../layout/colors';

const SuccessLabel = styled(animated.em)`
  display: inline-block;
  margin: 3px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  color: ${complementaryPrimary};
`;

export default SuccessLabel;

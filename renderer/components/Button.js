import { default as styled } from 'styled-components';
import { Button as BootstrapButton} from '@bootstrap-styled/v4';

const Button = styled(BootstrapButton)`
  height: 45px;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 8px;
`;

export default Button;

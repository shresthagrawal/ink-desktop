import { default as styled } from 'styled-components';
import { Textarea as BootstrapTextarea } from '@bootstrap-styled/v4';

const Textarea = styled(BootstrapTextarea)`
  ${props => `
    width: 100%;
    border: 3px solid ${props.theme['$btn-info-bg']};
    border-radius: 5px;
    padding: 5px 12px 8px;
    outline: 0 none;
    
    font-size: inherit;
    background: ${props.theme['$input-bg']};
    color: ${props.theme['$btn-info-bg']};
    
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    
    &:focus {
      color: ${props.theme['$btn-info-bg']};
      background-color: ${props.theme['$input-bg']};
      border-color: hsl(0,0%,11.8%);
    }
  `};
`;

export default Textarea;

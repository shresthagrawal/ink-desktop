import styled from 'styled-components';

const Text = styled.div`
  color: ${props => props.color || props.theme['$text-color']};
  font-size: ${props => props.size || props.theme['$font-size-md']};
  font-weight: ${props => props.weight || props.theme['$font-weight-base']};
  line-height: ${props => props.lineHeight || props.theme['$line-height-base']};
  text-align: ${props => props.align || 'left'};
`;

export default Text;

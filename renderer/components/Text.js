import { default as styled } from 'styled-components';

const Text = styled.div`
   ${props => `
        color: ${props.color  || props.theme["$text-color"]};
        font-size: ${props.size || props.theme["$font-size-md"]};
        font-weight: ${props.weight || props.theme["$font-weight-base"]};
        font-family: ${props.family || "Roboto"};
        line-height: ${props.lineHeight || '1'};
        text-align: ${props.align || "left"};
   `}
`;

export default Text; 

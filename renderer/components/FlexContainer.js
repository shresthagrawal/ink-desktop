import styled from 'styled-components';
import { Container } from '@bootstrap-styled/v4';

const FlexContainer = styled(Container)`
    ${
        props => `
            display: flex;
            flex-flow: ${props.flow  || 'column'};
            flex-grow: ${props.grow  || 1};
            justify-content: ${props.justifyContent || ''};
            align-items: ${props.alignItems || ''};
            min-height: 100%;
            padding: 0;
        `
    }  
`;
export default FlexContainer;
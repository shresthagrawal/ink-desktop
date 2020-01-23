import React from "react";
import styled from "styled-components";

const Space = styled(({children, ...props}) => React.cloneElement(children, props))`
    ${
        props => `
            padding: ${props.padding || ''};
            margin: ${props.margin || ''};
        `
    }
`;

export default Space;
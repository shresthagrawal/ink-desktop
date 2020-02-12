import React from "react";
import styled, { css } from "styled-components";

// FIXME: this is a bad practice, simply use the `style` prop of JSX nodes
const Space = styled(({children, ...props}) => React.cloneElement(children, props))`
    ${
        props => css`
            padding: ${props.padding || ''};
            margin: ${props.margin || ''};
        `
    }
`;

export default Space;

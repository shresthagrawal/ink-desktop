import React from "react";
import styled, { css } from "styled-components";

const Space = styled(({children, ...props}) => React.cloneElement(children, props))`
    ${
        props => css`
            padding: ${props.padding || ''};
            margin: ${props.margin || ''};
        `
    }
`;

export default Space;
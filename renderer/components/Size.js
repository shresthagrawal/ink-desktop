import styled, { css } from "styled-components";
import React from "react";

const Size = styled(({
    children,
    ...props
}) => React.cloneElement(children, props))`
    ${
        props => css`
            min-width: ${props.minWidth || ''};
            width: ${props.width || ''};
            max-width: ${props.maxWidth || ''};
            min-height: ${props.minHeight || ''};
            height: ${props.height || ''};
            max-height: ${props.maxHeight || ''};
        `
    }
`;

export default Size;
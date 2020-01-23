import React from "react";
import styled from "styled-components";

const Position = styled(({children, ...props}) => React.cloneElement(children, props))`
    ${
        props => `
            position: ${props.position || ''};
            top: ${props.top || ''};
            bottom: ${props.bottom || ''};
            left: ${props.left || ''};
            right: ${props.right || ''};
        `
    }
`;

export default Position;
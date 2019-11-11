import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import BootstrapProvider from '@bootstrap-styled/provider/lib/BootstrapProvider';
import theme from '../layout/theme';

const GlobalStyle = createGlobalStyle`
  html, body {
    min-width: 100%;
    min-height: 100%;
    margin: 0;
  }

  body {
    background: #181818;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  min-width: 100vw;
  min-height: 100vh;
`;

export default function Page({ children }) {
  return (
    <React.Fragment>
      <GlobalStyle />

      <BootstrapProvider theme={theme}>
        <Wrapper>{children}</Wrapper>
      </BootstrapProvider>
    </React.Fragment>
  );
}

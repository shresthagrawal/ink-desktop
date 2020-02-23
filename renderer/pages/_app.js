import React from 'react';
import App from 'next/app';
import { useRouter } from 'next/router';
import useBackendSubscription from '../effects/useBackendSubscription';

import 'typeface-inter';

function OpenProjectContainer() {
  if (typeof window === 'undefined') {
    return null;
  }

  const router = useRouter();
  useBackendSubscription('import-project-from-external', ({ remoteUrl }) => {
    router.push(`/home?importProject=${remoteUrl}`);
  });

  return null;
}

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <OpenProjectContainer />
        <Component {...pageProps} />
      </>
    );
  }
}

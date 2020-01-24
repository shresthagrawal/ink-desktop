import { remote } from 'electron';
import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { Row, Col, H5, Button, Container } from '@bootstrap-styled/v4';
import { complementarySecondary } from '../layout/colors';
import useProjects from '../effects/useProjects';
import useUser from '../effects/useUser';
import Page from '../components/Page';
import Header from '../components/Header';
import FlexContainer from '../components/FlexContainer';
import Panel from '../components/Panel';
import requestFromWorker from '../lib/requestFromWorker';
import { useRouter } from 'next/router';
import Spinner from '../components/Spinner';
import useTimeout from '../effects/useTimeout';

const TallRow = styled(Row)`
  flex-grow: 1;
  margin: 0 !important;
`;

const Message = styled.p`
  color: ${complementarySecondary};
`;

const ProjectName = styled.p`
  color: #fff;
`;

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const Home = () => {
  const { user, loading } = useUser();
  const { projects, setProjects } = useProjects();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [delayed, setDelayed] = useState(false);
  const startLoadingTimeout = useTimeout(() => setDelayed(true), 1000);

  const handleChooseRepository = useCallback(async () => {
    const { canceled, filePaths } = await remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    if (canceled || filePaths.length !== 1) {
      return;
    }

    const projectPath = filePaths[0];
    const projects = await requestFromWorker('add-project', projectPath);
    setProjects(projects);
  }, []);

  const handleResetProjects = useCallback(async () => {
    const projects = await requestFromWorker('reset-projects');
    setProjects(projects);
  }, []);

  useEffect(() => {
    // if `user.email` is undefined, there is no user logged in
    if (!!user && typeof user.email === 'undefined' && !loading) {
      router.push('/login');
    } else if (!!user && user.email && !loading) {
      setReady(true);
    }
  }, [user, loading]);

  useEffect(() => {
    if (ready && delayed) {
      setDelayed(false);
    } else if (!ready && !delayed) {
      startLoadingTimeout();
    }
  }, [ready, delayed]);

  return (
    <Page>
      <Head>
        <title>ununu • Ink</title>
      </Head>
      {!ready ? (
        <SpinnerContainer>
          {delayed && <Spinner role="status" />}
        </SpinnerContainer>
      ) : (
        <>
          <Header user={user} />
          <FlexContainer fluid={true}>
            <React.Fragment>
              <TallRow>
                <Panel md={2} />
                <Col className="bg-info p-3">
                  <Row>
                    <Col md={12}>
                      <H5>Projects</H5>
                    </Col>
                  </Row>

                  {projects.length > 0 ? (
                    projects.map(({ id, name, path }) => (
                      <Row key={`project-${id}`}>
                        <Col md={12}>
                          <Link href="/project/[id]" as={`/project/${id}`}>
                            <a href={`/project/${id}`}>
                              <ProjectName>{name}</ProjectName>
                            </a>
                          </Link>
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <Row>
                      <Col md={12}>
                        <Message>You have no active projects.</Message>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col md={12}>
                      <Button className="mr-2" onClick={handleChooseRepository}>
                        Add
                      </Button>
                      <Button className="mr-2" color="secondary">
                        Clone
                      </Button>
                      <Button className="mr-2" color="info">
                        Search
                      </Button>
                      {/*<Button className="mr-2" onClick={handleResetProjects}>
                        Reset Projects
                      </Button>*/}
                    </Col>
                  </Row>
                </Col>

                <Panel md={3}></Panel>
              </TallRow>
            </React.Fragment>
          </FlexContainer>
        </>
      )}
    </Page>
  );
};

export default Home;

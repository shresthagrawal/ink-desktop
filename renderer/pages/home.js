import { remote } from 'electron';
import { ipcRenderer as ipc } from 'electron-better-ipc';
import React, { useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { default as styled } from 'styled-components';
import {
  Row,
  Col,
  H5,
  Form,
  FormGroup,
  Label, Container,
} from '@bootstrap-styled/v4';
import { complementarySecondary } from '../layout/colors';
import useProjects from '../effects/useProjects';
import useUser from '../effects/useUser';
import Page from '../components/Page';
import Header from '../components/Header';
import Panel from '../components/Panel';
import Input from '../components/Input';
import Text from '../components/Text';
import Size from '../components/Size';
import Space from '../components/Space';
import Position from '../components/Position';
import Button from '../components/Button';
import FlexContainer from '../components/FlexContainer';
import useInput from '../effects/useInput';
import fetch from 'isomorphic-unfetch';
import loginBg from './login-bg.jpeg';

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

const Home = () => {
  const { user, setUser } = useUser();
  const { projects, setProjects } = useProjects();

  const { value: email, bind: bindEmail, reset: resetEmail } = useInput('');
  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword,
  } = useInput('');

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();

      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
      }

      // TODO call API once platform in place
      const user = await ipc.callMain('set-user', { email, password });
      setUser(user);
    },
    [email, password]
  );

  const handleChooseRepository = useCallback(async () => {
    const { canceled, filePaths } = await remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    if (canceled || filePaths.length !== 1) {
      return;
    }

    const projectPath = filePaths[0];
    const projects = await ipc.callMain('add-project', projectPath);
    setProjects(projects);
  }, []);

  const handleResetProjects = useCallback(async () => {
    const projects = await ipc.callMain('reset-projects');
    setProjects(projects);
  }, []);

  return (
    <Page>
      <Head>
        <title>ununu • Ink</title>
      </Head>
      <FlexContainer fluid={true}>
        {user && user.email ? (
          <React.Fragment>
            <Header user={user} />
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
        ) : (
            <FlexContainer
              fluid={true}
              justifyContent="center" 
              alignItems="center"
              style={{ backgroundImage: `url(${loginBg})`}}
            >
              <Size height="60px" width="100%">
                <Position position="fixed" top="0">
                  <div style={{background: '#181818'}}>
                    <FlexContainer fluid={true} justifyContent="center">
                      <Space padding="20px 14px">
                        <Text color="#fff" size="16px" weight="900" family="Bowlby One">INK</Text>
                      </Space>
                    </FlexContainer>
                  </div>
                </Position>
              </Size>
              <Text align="center" size="177px" family="Bowlby One">INK</Text>
              <Space padding="0 0 30px">
                <Text align="center" color="#fadabc" size="22px">TRUSTED MUSIC COLLABORATION</Text>
              </Space>
              <Size width="350px">
                <div>
                  <Form onSubmit={handleSubmit}>
                    <Space padding="0 0 16px">
                      <FormGroup>
                        <Input
                          required
                          type="email"
                          placeholder="Email"
                          size="sm"
                          {...bindEmail}
                        />
                      </FormGroup>
                    </Space>
                    <FormGroup>
                      <Input
                        required
                        type="password"
                        placeholder="Password"
                        size="sm"
                        {...bindPassword}
                      />
                    </FormGroup>
                    <Space padding="20px 0">
                      <div>
                        <Button 
                          type="submit"
                          block
                        >
                          Sign Up
                        </Button>
                      </div>
                    </Space>
                  </Form>
                </div>
              </Size>
            </FlexContainer>
          )}
      </FlexContainer>
    </Page>
  );
};

export default Home;

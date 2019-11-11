import React, { useCallback } from 'react';
import { ipcRenderer as ipc } from 'electron-better-ipc';
import styled from 'styled-components';
import { inviteCollaborator } from '../../../main/lib/utils/mail';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Col,
  H5,
  Row,
  Button,
  Form,
  FormGroup,
  Container,
} from '@bootstrap-styled/v4';
import Header from '../../components/Header';
import Page from '../../components/Page';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Panel from '../../components/Panel';
import PanelHeader from '../../components/PanelHeader';
import ShareImage from '../../components/ShareImage';
import useProjects from '../../effects/useProjects';
import useProjectState from '../../effects/useProjectState';
import useInput from '../../effects/useInput';
import useUser from '../../effects/useUser';

const FlexContainer = styled(Container)`
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  min-height: 100%;
  padding: 0;
`;

const TallRow = styled(Row)`
  flex-grow: 1;
  margin: 0 !important;
`;

export default function Repo() {
  const { query } = useRouter();
  const { projects } = useProjects();
  const { user } = useUser();
  const project = projects.find(project => project.id === query.id);

  // state is of the following structure:
  // state = { new: Array(), modified: Array(), deleted: Array() }
  const { state, graph } = useProjectState(project ? project.path : null);

  const {
    value: commitMessage,
    bind: bindCommitMessage,
    reset: resetCommitMessage,
  } = useInput('');

  const handleSignCommit = useCallback(
    async event => {
      event.preventDefault();

      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
      }
      const projectPath = project.path;
      await ipc.callMain('commit-project', { projectPath, commitMessage });

      resetCommitMessage();
    },
    [project, commitMessage]
  );

  const handleInvite = useCallback(async event => {
    event.preventDefault();
    await inviteCollaborator([
      'hallostefankarl@gmail.com',
      'shresthagrawal.31@gmail.com',
    ]);
  });

  return (
    <Page>
      <Head>
        <title>ununu • Ink</title>
      </Head>
      <Header user={user} />
      <FlexContainer fluid={true}>
        {project && (
          <TallRow>
            <Panel md={3}>
              <PanelHeader title="Local Changes" fontWeight="bold" />
              {/*state.new && state.new.length > 0 && (
                <React.Fragment>
                  <Row>
                    <H6>New Files</H6>
                  </Row>

                  {state.new.map((filePath, index) => (
                    <Row key={`new-${index}`}>
                      <Col md={12}>
                        <code>{filePath}</code>
                      </Col>
                    </Row>
                  ))}
                </React.Fragment>
              )*/}
              {/*state.modified && state.modified.length > 0 && (
                <React.Fragment>
                  <Row>
                    <H6>Modified Files</H6>
                  </Row>

                  {state.modified.map((filePath, index) => (
                    <Row key={`new-${index}`}>
                      <Col md={12}>
                        <code>{filePath}</code>
                        </Col>
                    </Row>
                  ))}
                </React.Fragment>
              )*/}

              {/* FIXME: JUST A MOCK */}
              <p>No changes to sign.</p>

              <Form onSubmit={handleSignCommit} className="m-2">
                <FormGroup>
                  <Input
                    required
                    type="text"
                    placeholder="Enter message"
                    {...bindCommitMessage}
                  />
                </FormGroup>
                <Button
                  disabled={
                    !(
                      (state.new && state.new.length > 0) ||
                      (state.modified && state.modified.length > 0)
                    )
                  }
                  className="mr-2"
                  type="submit"
                >
                  Sign
                </Button>
              </Form>
            </Panel>
            <Col className="bg-info p-3">
              <Row>
                <Col md={12}>
                  <H5>{project.name}</H5>
                </Col>
              </Row>
            </Col>
            <Panel md={3}>
              <PanelHeader title="Share" fontWeight="500" />
              <Form className="m-2" onSubmit={handleInvite}>
                <ShareImage />
                <FormGroup>
                  <Input required type="email" placeholder="Enter emails" />
                  <Textarea
                    required
                    placeholder="Write a message"
                    className="mt-2"
                  />
                </FormGroup>
                <Button className="mr-2" type="submit">
                  Send
                </Button>
              </Form>
            </Panel>
          </TallRow>
        )}
      </FlexContainer>
    </Page>
  );
}

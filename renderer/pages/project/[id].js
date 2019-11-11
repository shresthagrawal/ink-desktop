import React, { useCallback } from 'react';
import { ipcRenderer as ipc } from 'electron-better-ipc';
import styled from 'styled-components';
import { inviteCollaborator } from '../../../main/lib/utils/mail';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Col,
  H5,
  H6,
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
import CommitGraph from '../../components/CommitGraph';
import { highlightSecondary } from '../../layout/colors';

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

const TrackIcon = styled.em`
  margin-right: 8px;
  font-size: 24px;
  font-style: normal;
`;

const TrackName = styled.span`
  ${props => `
    font-size: 20px;
    line-height: 100%;
    color: ${props.theme['$text-color']};
  `};
`;

const MoreInfo = styled.em`
  font-style: normal;
  font-size: 16px;
  line-height: 100%;
  color: ${highlightSecondary};
`;

const TrackLine = styled(Col).attrs({
  md: 12,
})`
  margin-top: ${props => (props.offset ? 14 : 10)}px;
`;

const mockCommits = [
  {
    hash: 'foo',
    author: {
      name: 'Emma',
    },
    message: 'Create project',
    tags: ['drums'],
  },
  {
    hash: 'bar',
    author: {
      name: 'Tim',
    },
    message: 'Tweak some sounds',
    tags: ['vocals', 'fx'],
  },
];
const trackEmoji = ['🎸', '🥁', '🎺', '🎶', '🎷'];

export default function Repo() {
  const { query } = useRouter();
  const { projects } = useProjects();
  const { user } = useUser();
  const project = projects.find(project => project.id === query.id);

  // state is of the following structure:
  // state = { new: Array(), modified: Array(), deleted: Array() }
  const { status, graph, delta } = useProjectState(
    project ? project.path : null
  );

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
              <PanelHeader title="Changed Tracks" fontWeight="bold" />
              {delta.tracks && delta.tracks.length > 0 && (
                <React.Fragment>
                  {delta.tracks.slice(1, 5).map((trackName, index) => (
                    <TrackLine key={`new-${index}`}>
                      <TrackIcon>{trackEmoji[index]}</TrackIcon>
                      <TrackName>{trackName}</TrackName>
                    </TrackLine>
                  ))}

                  {delta.tracks.length > 5 && (
                    <TrackLine offset>
                      <MoreInfo>
                        + {delta.tracks.length - 5} more tracks
                      </MoreInfo>
                    </TrackLine>
                  )}
                </React.Fragment>
              )}

              {/*status.new && status.new.length > 0 && (
                <React.Fragment>
                  <Row>
                    <H6>New Files</H6>
                  </Row>

                  {status.new.map((filePath, index) => (
                    <Row key={`new-${index}`}>
                      <Col md={12}>
                        <code>{filePath}</code>
                      </Col>
                    </Row>
                  ))}
                </React.Fragment>
              )*/}
              {/*status.modified && status.modified.length > 0 && (
                <React.Fragment>
                  <Row>
                    <H6>Modified Files</H6>
                  </Row>

                  {status.modified.map((filePath, index) => (
                    <Row key={`new-${index}`}>
                      <Col md={12}>
                        <code>{filePath}</code>
                        </Col>
                    </Row>
                  ))}
                </React.Fragment>
              )*/}

              <Form onSubmit={handleSignCommit} className="m-2 mt-4">
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
                      (status.new && status.new.length > 0) ||
                      (status.modified && status.modified.length > 0)
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
              <Row>
                <Col md={12}>
                  <CommitGraph graph={mockCommits.concat(graph)} />
                </Col>
              </Row>
            </Col>
            <Panel md={3}>
              <PanelHeader title="Share" fontWeight="500" />
              <Form className="m-2" onSubmit={handleInvite}>
                <ShareImage />
                <FormGroup>
                  <Input required type="email" placeholder="Recipient" />
                  <Textarea required placeholder="Message" className="mt-2" />
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

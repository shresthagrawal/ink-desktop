import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  Col,
  H5,
  Row,
  Button as BootstrapButton,
  Form,
  FormGroup,
} from '@bootstrap-styled/v4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header';
import Input from '../Input';
import Panel from '../Panel';
import PanelHeader from '../PanelHeader';
import useProjects from '../../effects/useProjects';
import useProjectState from '../../effects/useProjectState';
import useInput from '../../effects/useInput';
import useUser from '../../effects/useUser';
import CommitGraph from '../CommitGraph';
import {
  buttonPrimary,
  complementaryPrimary,
  highlightSecondary,
  playerBackground,
} from '../../layout/colors';
import HistoryIcon from '../HistoryIcon';
import useTemporaryState from '../../effects/useTemporaryState';
import useFade from '../../effects/useFade';
import { initialMockCommits, trackEmoji } from '../../mocks';
import { request } from '../../lib/backend';
import Space from '../Space';
import Text from '../Text';
import Size from '../Size';
import { Button } from '../form';
import SuccessLabel from '../SuccessLabel';
import SyncStatus from '../SyncStatus';

import bg from '../../layout/images/mesh.jpeg';
import FlexContainer from '../FlexContainer';
import useBackendRequest from '../../effects/useBackendRequest';
import { fadeIn } from '../../layout/animations';
import ProjectInvite from './Invite';
import useBackendSubscription from '../../effects/useBackendSubscription';

const TallRow = styled(Row)`
  flex-grow: 1;
  margin: 0 !important;
  height: 100%;
  box-sizing: border-box;
`;

const TrackIcon = styled.em`
  margin-right: 8px;
  font-size: 24px;
  font-style: normal;
`;

const TrackName = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  margin-top: ${(props) => (props.offsetTop || 0) + 10}px;
`;

const NoNewTracksLine = styled(TrackLine)`
  margin-top: 12px;
`;

const ActionsList = styled.ul`
  display: flex;
  flex-flow: row;
  flex-grow: 0;

  width: 100%;
  min-height: 50px;
  margin: 0;
  padding: 10px;
  box-sizing: border-box;

  list-style: none;
  background: ${playerBackground};
`;

const ActionItem = styled.li``;

const FadeInButton = styled(Button)`
  animation: ${fadeIn} 250ms ease-out;
`;

const CenterPanel = styled(Col)`
  overflow: hidden;
  background: url(${bg});
`;

const CommitGraphContainer = styled(Row)`
  overflow: auto;
  height: 100%;
`;

const LocalChangesDivider = styled.div`
  width: 100%;
  height: 6px;
  background: #181818;
`;

const LocalChangesList = styled.div`
  min-height: 300px;
  max-height: calc(100vh - 320px);
  overflow: auto;
`;

const LocalChangeHorizontalBranch = styled.div`
  width: 23px;
  height: 0px;
  border: 1px solid #929292;
  margin-right: 10px;
  flex-shrink: 0;
`;

const LocalChangeVerticalBranch = styled.div`
  width: 2px;
  height: ${(props) => props.height};
  background: #929292;
  align-self: flex-start;
  flex-shrink: 0;
`;

export default function ProjectWrapper({ id }) {
  const { projects } = useProjects();
  const { user } = useUser();

  if (!projects || !user) {
    return null;
  } else {
    return <Project {...{ id, projects, user }} />;
  }
}

function Project({ id, projects, user }) {
  const [canOpenProject] = useBackendRequest('can-open-project');
  const [synchronizing, setSynchronizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [commitSigned, setCommitSigned] = useTemporaryState(false, 5000);

  const commitSignedTransitions = useFade(commitSigned);
  const project = projects.find((project) => project.id === id);

  // state is of the following structure:
  // state = { new: Array(), modified: Array(), deleted: Array() }
  const { graph, diff, reloadProjectState } = useProjectState(
    project ? project.id : null
  );

  const {
    value: commitMessage,
    bind: bindCommitMessage,
    reset: resetCommitMessage,
  } = useInput('');

  const handleSignCommit = useCallback(
    async (event) => {
      event.preventDefault();

      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
      }
      await request('commit-project', {
        projectId: project.id,
        commitMessage,
      });

      resetCommitMessage();
      setCommitSigned(true);
      await reloadProjectState();
    },
    [project, commitMessage]
  );

  const handlePush = useCallback(
    async (event) => {
      event.preventDefault();

      if (synchronizing) {
        return;
      }

      setSynchronizing(true);
      await request(
        'push-project',
        {
          projectId: project.id,
        },
        {
          onProgress: (progress) => setProgress(progress),
        }
      );
      setSynchronizing(false);
    },
    [project, synchronizing]
  );

  const handlePull = useCallback(
    async (event) => {
      event.preventDefault();

      if (synchronizing) {
        return;
      }

      setSynchronizing(true);
      await request(
        'pull-project',
        {
          projectId: project.id,
        },
        {
          onProgress: (progress) => setProgress(progress),
        }
      );
      setSynchronizing(false);
      await reloadProjectState();
    },
    [project, synchronizing]
  );

  const handleOpenProject = useCallback(async (event) => {
    event.preventDefault();
    await request('open-project', { projectId: project.id });
  });

  const handleRefreshProject = useCallback(async (event) => {
    event.preventDefault();
    await reloadProjectState();
  });

  useBackendSubscription('project-changed', async ({ projectId }) => {
    if (projectId !== id) {
      return;
    }
    await reloadProjectState();
  });

  //TODO: This is just a hack solution a better way must be there 
  let changedFiles = [];
  if (diff && diff.new && diff.modified && diff.deleted) {
    changedFiles = changedFiles.concat(diff.new);
    changedFiles = changedFiles.concat(diff.modified);
    changedFiles = changedFiles.concat(diff.deleted);
  }

  return (
    <>
      {user ? <Header user={user} project={project} /> : null}
      {project ? (
        <Space padding="76px 0 0">
          <TallRow>
            <Panel md={2}>
              <PanelHeader
                title="Local changes"
                fontWeight="bold"
                fontSize="18px"
                renderIcon={() => (
                  <Space margin="0 20px 0 0">
                    <FontAwesomeIcon
                      color="#74757A"
                      size="lg"
                      icon={faDesktop}
                    />
                  </Space>
                )}
              />
              <LocalChangesList>
                {changedFiles && changedFiles.length > 0? (
                  <>
                    {changedFiles.map((trackName, index) => (
                      <React.Fragment key={`new-${index}`}>
                        {index === 0 ? (
                          <Space margin="0 30px">
                            <LocalChangeVerticalBranch height="20px" />
                          </Space>
                        ) : null}
                        <Size height="40px">
                          <Space margin="0 30px">
                            <FlexContainer flow="row" alignItems="center">
                              <LocalChangeVerticalBranch
                                height={
                                  index < changedFiles.length - 1
                                    ? '40px'
                                    : '21px'
                                }
                              />
                              <LocalChangeHorizontalBranch />
                              <TrackIcon>{trackEmoji[index % 5]}</TrackIcon>
                              <TrackName size="16px">{trackName}</TrackName>
                            </FlexContainer>
                          </Space>
                        </Size>
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <NoNewTracksLine>
                    <MoreInfo>No new tracks.</MoreInfo>
                  </NoNewTracksLine>
                )}
              </LocalChangesList>
              <LocalChangesDivider />
              <Form onSubmit={handleSignCommit} className="m-2 mt-4">
                <Space padding="10px 20px">
                  <div>
                    <FormGroup>
                      <Input
                        required
                        type="text"
                        placeholder="Enter message"
                        {...bindCommitMessage}
                      />
                    </FormGroup>
                    <FlexContainer flow="row">
                      <Space margin="0 10px 0 0">
                        <BootstrapButton
                          size="sm"
                          disabled={
                            (!diff || !diff.deleted || !diff.modified || !diff.new || 
                            (diff.deleted.length == 0 && diff.modified.length == 0 && diff.new.length == 0))
                          }
                          type="submit"
                        >
                          Sign
                        </BootstrapButton>
                      </Space>
                      <Space margin="0 10px 0 0">
                        <BootstrapButton
                          size="sm"
                          onClick={handlePush}
                          color="secondary"
                          disabled={synchronizing}
                        >
                          Push
                        </BootstrapButton>
                      </Space>
                      <BootstrapButton
                        size="sm"
                        onClick={handlePull}
                        color="info"
                        disabled={synchronizing}
                      >
                        Pull
                      </BootstrapButton>
                    </FlexContainer>
                  </div>
                </Space>
                {commitSignedTransitions.map(
                  ({ item, key, props }) =>
                    item && (
                      <SuccessLabel key={key} style={props}>
                        Signed!
                      </SuccessLabel>
                    )
                )}
              </Form>
            </Panel>
            <CenterPanel className="bg-info">
              <Row>
                <Size width="100%">
                  <ActionsList>
                    {canOpenProject && (
                      <ActionItem>
                        <FadeInButton onClick={handleOpenProject}>
                          Open in Ableton Live
                        </FadeInButton>
                      </ActionItem>
                    )}
                  </ActionsList>
                </Size>
              </Row>
              <CommitGraphContainer className="mt-3">
                <CommitGraph graph={initialMockCommits.concat(graph)} />
              </CommitGraphContainer>
            </CenterPanel>

            <ProjectInvite project={project} user={user} />
          </TallRow>
        </Space>
      ) : null}

      {synchronizing && <SyncStatus progress={progress} />}
    </>
  );
}

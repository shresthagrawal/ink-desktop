import React, { useCallback } from 'react';
import PanelHeader from '../PanelHeader';
import {
  Button as BootstrapButton,
  Form,
  FormGroup,
} from '@bootstrap-styled/v4';
import Space from '../Space';
import ShareImage from '../ShareImage';
import Text from '../Text';
import Input from '../Input';
import Textarea from '../Textarea';
import Panel from '../Panel';
import useFade from '../../effects/useFade';
import requestFromWorker from '../../lib/requestFromWorker';
import { inviteCollaborators } from '../../lib/mail';
import useTemporaryState from '../../effects/useTemporaryState';
import useInput from '../../effects/useInput';
import styled from 'styled-components';
import SuccessLabel from '../SuccessLabel';

const SendButton = styled(BootstrapButton)`
  float: right;
  margin-bottom: 20px;
`;

export default function ProjectInvite({ project, user }) {
  const [mailSent, setMailSent] = useTemporaryState(false, 5000, () => {
    resetInvitationRecipient();
    resetInvitationMessage();
  });
  const mailSentTransitions = useFade(mailSent);

  const {
    value: invitationRecipient,
    bind: bindInvitationRecipient,
    reset: resetInvitationRecipient,
  } = useInput('');

  const {
    value: invitationMessage,
    bind: bindInvitationMessage,
    reset: resetInvitationMessage,
  } = useInput('');

  const handleInvite = useCallback(async event => {
    event.preventDefault();

    const remoteUrl = await requestFromWorker('get-remote', {
      projectId: project.id,
    });
    const recipients = invitationRecipient
      .split(/[ ,]+/)
      .map(recipient => recipient.trim());

    await inviteCollaborators(
      recipients,
      invitationMessage,
      project.name,
      remoteUrl,
      user
    );
    setMailSent(true);
  });

  return (
    <Panel md={3}>
      <PanelHeader title={project.name.toUpperCase()} fontSize="18px" />
      <Form className="m-2" onSubmit={handleInvite}>
        <Space padding="40px">
          <div>
            <ShareImage />
          </div>
        </Space>
        <Space padding="0 20px">
          <div>
            <Text size="22px" weight="500" align="center">
              Share it!
            </Text>
            <Space padding="4px 0 24px">
              <Text size="18px" align="center" height="21px">
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.
              </Text>
            </Space>
            <FormGroup>
              <Input
                required
                type="email"
                placeholder="Recipient"
                {...bindInvitationRecipient}
              />
            </FormGroup>
            <FormGroup>
              <Textarea
                required
                placeholder="Message"
                className="mt-2"
                {...bindInvitationMessage}
              />
            </FormGroup>
            <SendButton size="sm" type="submit">
              Send
            </SendButton>
            {mailSentTransitions.map(
              ({ item, key, props }) =>
                item && (
                  <SuccessLabel key={key} style={props}>
                    Sent!
                  </SuccessLabel>
                )
            )}
          </div>
        </Space>
      </Form>
    </Panel>
  );
}

import React, { useRef, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { animated } from 'react-spring';
import {
  Button as _Button,
  FormGroup as _FormGroup,
  Label as _Label,
} from '@bootstrap-styled/v4';
import _Input from './Input';
import ModalSpinner from './ModalSpinner';
import useFade from '../effects/useFade';
import useOnClickOutside from '../effects/useOnClickOutside';
import useBodyLockScroll from '../effects/useBodyLockScroll';
import useGrowRightAndFade from '../effects/useGrowRightAndFade';
import { backgroundPanel, userBackground } from '../layout/colors';
import { remote } from 'electron';

const ContainerWrapper = styled.div`
  position: fixed;
  top: 0;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
  pointer-events: ${props => (props.active ? 'auto' : 'none')};
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-flow: column;

  width: 500px;
  height: 350px;
  border-radius: 5px;
  overflow: hidden;

  background: black;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.65);
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.65);

  opacity: ${props => (props.active ? 1 : 0)};
  pointer-events: ${props => (props.active ? 'auto' : 'none')};
  user-select: none;

  transition: opacity 125ms ease-in-out;
`;

const Header = styled.div`
  display: flex;
  flex-flow: row;
  padding: 10px;
  background-color: ${userBackground};
`;

const Body = styled(Header)`
  flex-flow: column;
  flex-grow: 1;
  background-color: ${userBackground};
`;

const Footer = styled(Header)`
  background-color: ${backgroundPanel};
`;

const Title = styled.h3`
  margin: 0;
  padding: 5px;

  font-weight: 600;
  color: white;
`;

const Button = styled(_Button)`
  padding: 7px 10px !important;
  font-size: 14px !important;
`;

const OffsettingButton = styled(Button)`
  margin-left: 0;
  margin-right: auto;
`;

const TextInput = styled(_Input)`
  width: 100%;
  height: auto;
  padding: 7px 10px;
  border: 1px solid rgb(140, 140, 140);
  border-radius: 5px;

  line-height: 100%;
  color: rgb(140, 140, 140);
  background-color: ${userBackground};
  transition: color 125ms ease-in-out, border-color 125ms ease-in-out;

  ::placeholder {
    color: rgb(100, 100, 100);
  }

  &:focus,
  &:active {
    outline: none;

    border-color: rgb(200, 200, 200);
    color: rgb(200, 200, 200);
  }
`;

const Label = styled(_Label)`
  margin: 0 0 3px;
  padding-left: 8px;
  font-size: 11px;
  color: rgb(140, 140, 140);
`;

const FormGroup = styled(_FormGroup)`
  display: flex;
  flex-flow: column;

  width: 100%;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SplitInput = styled.div`
  display: flex;
  flex-flow: row;
`;

const InputButton = styled(Button)`
  margin-left: 10px;
`;

const Fieldset = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
`;

const SpinnerContainer = styled.div`
  display: inline-block;
  width: auto;
  height: 16px;
  color: white;
`;

const Dialog = ({
  style,
  disabled,
  processing = false,
  onDismiss,
  onSubmit,
  projectUrl: givenProjectUrl,
}) => {
  const [projectUrl, setProjectUrl] = useState(givenProjectUrl);
  const [projectPath, setProjectPath] = useState('');
  const dialogRef = useRef();
  const inputRef = useRef();

  const spinnerTransitions = useGrowRightAndFade(processing, {
    maxWidth: 30,
    marginRight: 15,
  });

  useBodyLockScroll();
  useOnClickOutside(dialogRef, onDismiss);

  const handleProjectUrlChange = useCallback(event =>
    setProjectUrl(event.target.value)
  );
  const handleProjectPathChange = useCallback(event =>
    setProjectPath(event.target.value)
  );

  const handleBrowse = useCallback(() => {
    (async () => {
      const { canceled, filePaths } = await remote.dialog.showOpenDialog({
        properties: ['openDirectory'],
      });

      if (!canceled && filePaths.length > 0) {
        setProjectPath(filePaths[0]);
      }
    })();
  });

  const handleSubmit = useCallback(() => onSubmit(projectUrl, projectPath));

  return (
    <BodyWrapper ref={dialogRef} as={animated.div} style={style}>
      <Header as="header">
        <Title>Clone Project</Title>
      </Header>
      <Body>
        <Fieldset disabled={disabled}>
          <FormGroup>
            <Label htmlFor="projectUrl">Project URL</Label>
            <TextInput
              id="projectUrl"
              name="projectUrl"
              type="text"
              size="lg"
              placeholder="https://git.example.com/project.git"
              value={projectUrl}
              onChange={handleProjectUrlChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="projectUrl">Local Project Path</Label>
            <SplitInput>
              <TextInput
                id="projectPath"
                name="projectPath"
                type="text"
                size="lg"
                placeholder="~/Music/Projects"
                value={projectPath}
                onChange={handleProjectPathChange}
                ref={inputRef}
              />
              <InputButton onClick={handleBrowse}>Browse</InputButton>
            </SplitInput>
          </FormGroup>
        </Fieldset>
      </Body>
      <Footer as="footer">
        <OffsettingButton onClick={onDismiss} disabled={disabled}>
          Cancel
        </OffsettingButton>

        {spinnerTransitions.map(
          ({ item, key, props }) =>
            item && (
              <SpinnerContainer as={animated.div} key={key} style={props}>
                <ModalSpinner />
              </SpinnerContainer>
            )
        )}
        <Button
          onClick={handleSubmit}
          disabled={disabled || !projectPath}
          color="success"
        >
          Clone
        </Button>
      </Footer>
    </BodyWrapper>
  );
};

export default function ModalDialog({
  active,
  disabled,
  processing,
  onDismiss,
  onSubmit,
  projectUrl,
}) {
  const dialogTransitions = useFade(active, { transform: false });

  return (
    <>
      <ContainerWrapper active={active}>
        {dialogTransitions.map(
          ({ item, key, props }) =>
            item && (
              <Dialog
                key={key}
                style={props}
                projectUrl={projectUrl}
                disabled={disabled || processing}
                processing={processing}
                onDismiss={onDismiss}
                onSubmit={onSubmit}
              />
            )
        )}
      </ContainerWrapper>
      <Backdrop active={active} />
    </>
  );
}

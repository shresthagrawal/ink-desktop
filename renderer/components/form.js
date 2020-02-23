import styled from 'styled-components';
import {
  Button as _Button,
  FormGroup as _FormGroup,
  Label as _Label,
} from '@bootstrap-styled/v4';
import _Input from './Input';
import { userBackground } from '../layout/colors';

export const Button = styled(_Button)`
  padding: 7px 10px !important;
  font-size: 14px !important;
`;

export const Label = styled(_Label)`
  margin: 0 0 3px;
  padding-left: 8px;
  font-size: 11px;
  color: rgb(140, 140, 140);
`;

export const TextInput = styled(_Input)`
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

export const SplitInput = styled.div`
  display: flex;
  flex-flow: row;
`;

export const InputButton = styled(Button)`
  margin-left: 10px;
`;

export const Fieldset = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
`;

export const FormGroup = styled(_FormGroup)`
  display: flex;
  flex-flow: column;

  width: 100%;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

import { ipcRenderer as ipc } from 'electron-better-ipc';
import React, { useCallback } from 'react';
import { withRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { default as styled } from 'styled-components';
import {
  Row,
  Button,
  Jumbotron,
  Form,
  FormGroup,
  Label, Container,
} from '@bootstrap-styled/v4';
import { complementarySecondary } from '../layout/colors';
import useUser from '../effects/useUser';
import Page from '../components/Page';
import Header from '../components/Header';
import Input from '../components/Input';
import useInput from '../effects/useInput';

const FlexContainer = styled(Container)`
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  min-height: 100%;
  padding: 0;
`;

const Login = ({ router }) => {
  const { user, setUser } = useUser();

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

      router.push('/home');
    },
    [email, password]
  );

  return (
    <Page>
      <Head>
        <title>ununu • Ink</title>
      </Head>
      <Header user={user} />
        <Jumbotron className="py-3">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Email</Label>
              <Input
                required
                type="email"
                placeholder="Enter email"
                {...bindEmail}
              />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input
                required
                type="password"
                placeholder="Enter password"
                {...bindPassword}
              />
            </FormGroup>
            <Button className="mr-2" type="submit">
              Login
            </Button>
          </Form>
        </Jumbotron>
    </Page>
  );
};

export default withRouter(Login);

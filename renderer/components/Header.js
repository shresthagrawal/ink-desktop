import React from 'react';
import styled from 'styled-components';
import Size from '../components/Size';
import Position from '../components/Position';
import Text from '../components/Text';
import Space from '../components/Space';
import FlexContainer from '../components/FlexContainer';
import UserImage from '../components/UserImage';
import avatar from '../layout/images/avatar-1.png'
import { Button } from './form';

const ActionsContainer = styled.div`
  padding: 16px;
`;

const Header = ({ user }) => (
  <Position position="absolute" zIndex={1}>
    <Size width="100%">
      <FlexContainer flow="row" justifyContent="space-between" alignItems="center" style={{ background: '#181818' }}>
        <Space padding="16px">
          <FlexContainer flow="row" alignItems="center">
            <UserImage src={avatar} alt="User" size="40px" borderColor="#A3C4CB" />
            <Text color="#fff">{user.email}</Text>
          </FlexContainer>
        </Space>
        <ActionsContainer>
          <Button>Logout</Button>
        </ActionsContainer>
      </FlexContainer>
    </Size>
  </Position>
);

export default Header;

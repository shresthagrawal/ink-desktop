import React from 'react';
import styled from 'styled-components';
import { buttonInfo } from '../layout/colors';

const Container = styled.ul`
  display: flex;
  flex-flow: column;

  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  flex-flow: row;
  margin: 10px 0 0;
  padding: 0;
`;

const AuthorImage = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 30px;
  background: #ddd;
`;

const Name = styled.p`
  display: inline-block;
  margin: 1px 10px 1px 0;
  font-size: 20px;
  line-height: 140%;
  color: ${buttonInfo};
`;

const Message = styled.p`
  display: inline-block;
  font-size: 20px;
  line-height: 140%;
  margin: 1px 0;
`;

export default function CommitGraph({ graph }) {
  return (
    <Container>
      {graph.map(({ hash, author, message }) => (
        <Item key={`commit-${hash}`}>
          <AuthorImage />
          <Name>{author.name}:</Name> <Message>{message}</Message>
        </Item>
      ))}
    </Container>
  );
}

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
  margin-bottom: 10px;
`;

const Author = styled.p`
  display: inline-block;
  color: ${buttonInfo};
`;

export default function CommitGraph({ graph }) {
  return (
    <Container>
      {graph.map(({ hash, author, message, data }) => (
        <Item key={`commit-${hash}`}>
          <Author>{author.name}:</Author> {message}
        </Item>
      ))}
    </Container>
  );
}

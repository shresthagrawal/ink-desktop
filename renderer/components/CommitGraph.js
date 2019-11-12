import React from 'react';
import styled, { css } from 'styled-components';
import {
  buttonInfo,
  complementaryPrimary,
  highlightSecondary,
} from '../layout/colors';
import useFade from '../effects/useFade';
import { Form } from '@bootstrap-styled/v4';
import { animated } from 'react-spring';

const mockCommit = {
  hash: 'stefanscommit1337',
  author: {
    name: 'Stefan',
  },
  message: "Adjust EQ on Shresth's rec",
};

const Container = styled.ul`
  display: flex;
  flex-flow: column;

  margin: 10px 0 0;
  padding: 0;
  list-style: none;
`;

const Dot = styled.div`
  z-index: 20;
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 7px 16px 7px 11px;
  border-radius: 16px;
  background: ${complementaryPrimary};
`;

const Line = styled.div`
  position: absolute;
  top: 23px;
  left: 18px;
  width: 2px;
  height: 100%;
  background: ${complementaryPrimary};
`;

const BranchLine = styled(Line)`
  top: 8px;
  left: 30px;
  z-index: 10;
  height: 52px;
  transform: rotate(-33deg);
  background: ${props => props.color};
`;

const MergeLine = styled(BranchLine)`
  top: auto;
  bottom: -20px;
  left: 36px;
  height: 60px;
  transform: rotate(33deg);
`;

const AuthorImage = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 30px;
  background: #ddd;
`;

const BranchGraph = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Message = styled.p`
  display: inline-block;
  font-size: 20px;
  line-height: 140%;
  margin: 1px 0;
  color: ${complementaryPrimary};
`;

const Item = styled.li`
  position: relative;
  display: flex;
  flex-flow: column;
  margin: 0 0 0 ${props => (props.level ? props.level * 30 : 0)}px;
  padding: 0;

  &:last-child {
    ${Line} {
      display: none;
    }
  }

  ${AuthorImage} {
    margin-left: ${props => (props.level && props.level === 1 ? 10 : 40)}px;
  }

  ${props =>
    props.color &&
    css`
      ${Dot} {
        background: ${props.color};
      }

      ${Line} {
        background: ${props.color};
      }

      ${Message} {
        color: ${props.color};
      }
    `}
`;

const Commit = styled.div`
  display: flex;
  flex-flow: row;
  margin-bottom: 16px;
`;

const Name = styled.p`
  display: inline-block;
  margin: 1px 6px 1px 0;
  font-size: 20px;
  line-height: 140%;
  color: ${buttonInfo};
`;

export default function CommitGraph({ graph, showMockCommit }) {
  const mockCommitTransitions = useFade(showMockCommit, false);

  return (
    <Container>
      {graph.map(({ hash, author, message, subBranch = [] }) => (
        <Item key={`commit-${hash}`}>
          <Commit>
            <Dot />
            <Line />
            <AuthorImage />
            <Name>{author.name}:</Name> <Message>{message}</Message>
          </Commit>

          {subBranch.length > 0 && (
            <>
              <BranchLine color={highlightSecondary} />
              <BranchGraph>
                {subBranch.map(({ hash, author, message }) => (
                  <Item
                    key={`commit-${hash}`}
                    level={1}
                    color={highlightSecondary}
                  >
                    <Commit>
                      <Dot />
                      <Line />
                      <AuthorImage />
                      <Name>{author.name}:</Name> <Message>{message}</Message>
                    </Commit>
                  </Item>
                ))}
              </BranchGraph>
              <MergeLine color={highlightSecondary} />
            </>
          )}
        </Item>
      ))}

      {mockCommitTransitions.map(
        ({ item, key, props }) =>
          item && (
            <Item as={animated.li} key={key} style={props}>
              <Commit>
                <Dot />
                <Line />
                <AuthorImage />
                <Name>{mockCommit.author.name}:</Name>{' '}
                <Message>{mockCommit.message}</Message>
              </Commit>
            </Item>
          )
      )}
    </Container>
  );
}

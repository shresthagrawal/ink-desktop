import styled from 'styled-components';
import Link from 'next/link';
import Logo from './Logo';
import { backgroundPanel, buttonInfo } from '../layout/colors';
import ProjectIcon from './ProjectIcon';

const HomeLink = styled.a`
  &:hover {
    background-color: ${backgroundPanel};
  }
`;

const LogoWrapper = styled.div`
  padding: 14px 30px;
`;

const Container = styled.div`
  display: flex;
  flex-flow: row;
  height: 60px;
`;

const Meta = styled.div`
  display: flex;
  flex-flow: row;
  flex-grow: 1;
  justify-content: center;
`;

const ProjectInfo = styled.div`
  display: flex;
  flex-grow: 1;
  justify-self: flex-start;
  align-items: center;
  margin: 0 auto;
  padding: 0px 25px;
  line-height: 100%;
  color: ${buttonInfo};
`;

const ProjectName = styled.span`
  display: inline-block;
  margin-left: 10px;
`;

const UserInfo = styled(ProjectInfo)`
  flex-grow: 0;
  margin-right: 0;
  justify-self: flex-end;
`;

const UserImage = styled.div`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 30px;
  background-color: #ddd;
`;

export default function Header({ user, project }) {
  const href = user && user.email ? '/home' : '/login';
  // TODO if project, add Download, Upload, Branch, Settings icon to UserHeading
  return (
    <Container>
      <Link href={href}>
        <HomeLink href={href}>
          <LogoWrapper>
            <Logo width={80} />
          </LogoWrapper>
        </HomeLink>
      </Link>
      <Meta>
        {project && (
          <ProjectInfo>
            <ProjectIcon />
            <ProjectName>{project.name}</ProjectName>
          </ProjectInfo>
        )}
        {user && (
          <UserInfo>
            <UserImage />
            {user.email}
          </UserInfo>
        )}
      </Meta>
    </Container>
  );
}

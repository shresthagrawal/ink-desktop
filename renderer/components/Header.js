import styled from 'styled-components';
import Link from 'next/link';
import Logo from './Logo';
import Heading from './Heading';
import UserHeading from './UserHeading';

const linkStyle = {
  height: '60px',
};

const Container = styled.div``;

export default function Header({ user, project }) {
  // TODO if project, add Download, Upload, Branch, Settings icon to UserHeading
  return (
    <Container>
      <Link href="/home">
        <Heading>
          <Logo width={29} height={22} />
        </Heading>
      </Link>
      <UserHeading>{user && user.email ? user.email : ''}</UserHeading>
    </Container>
  );
}

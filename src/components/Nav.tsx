import {FC} from 'react';
import {Menu, Layout, Dropdown} from 'antd';
import {useAuth} from '../providers/auth';
import {Link, useLocation} from 'wouter';

const {Header} = Layout;

const Nav: FC = () => {
  const {user, logout} = useAuth();
  const [, setLocation] = useLocation();

  // TODO: how do I use this with wouter?

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Menu style={{width: '100%'}} theme="dark" mode="horizontal">
        <Menu.Item key="/">
          <Link href="/">
            <a>Home</a>
          </Link>
        </Menu.Item>

        {user?.isAdmin && (
          <Menu.Item key="/club-days">
            <Link href="/club-days">
              <a>Club Days</a>
            </Link>
          </Menu.Item>
        )}
      </Menu>
      {user && (
        <Dropdown
          menu={{
            items: [
              {
                key: 'logout',
                label: 'logout',
                danger: true,
                onClick() {
                  logout();
                  setLocation('/');
                },
              },
            ],
          }}
        >
          <div
            style={{
              backgroundColor: '#9c9cfc',
              borderRadius: '50%',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '50px',
              userSelect: 'none',
              fontSize: '1.5em',
            }}
          >
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
        </Dropdown>
      )}
    </Header>
  );
};

export default Nav;

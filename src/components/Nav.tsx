import Dropdown from 'antd/es/dropdown/dropdown';
import {Header} from 'antd/es/layout/layout';
import Menu from 'antd/es/menu';
import type {MenuItemType} from 'antd/es/menu/interface';
import type {FC} from 'react';
import {Link, useLocation} from 'wouter';
import {useAuth} from '../providers/auth';

const Nav: FC = () => {
  const {user, logout} = useAuth();
  const [, setLocation] = useLocation();

  // TODO: how do I use this with wouter?

  const menuItems: MenuItemType[] = [
    {key: '/', label: <Link href='/'>Home</Link>},
  ];

  if (user) {
    menuItems.push({
      key: '/check-in',
      label: <Link href='/check-in'>Check In</Link>,
    });
  }

  if (user?.isClubAdmin || user?.isAdmin) {
    menuItems.push({
      key: '/club-days',
      label: <Link href='/club-days'>Club Days</Link>,
    });
  }

  if (user?.isAdmin) {
    menuItems.push(
      {key: '/clubs', label: <Link href='/clubs'>Clubs</Link>},
      {key: '/users', label: <Link href='/users'>Users</Link>}
    );
  }

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Menu
        style={{width: '100%'}}
        theme='dark'
        mode='horizontal'
        items={menuItems}
      />

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

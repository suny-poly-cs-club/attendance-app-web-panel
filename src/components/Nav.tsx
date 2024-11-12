import type {FC} from 'react';
import {Menu, Layout, Dropdown} from 'antd';
import {useAuth} from '../providers/auth';
import {Link, useLocation} from 'wouter';
import type {MenuItemType} from 'antd/es/menu/interface';

const {Header} = Layout;

const Nav: FC = () => {
  const {user, logout} = useAuth();
  const [, setLocation] = useLocation();

  // TODO: how do I use this with wouter?

  const menuItems: MenuItemType[] = [
    {key: '/', label: (<Link href='/'>Home</Link>)},
  ];

  if (user) {
    menuItems.push({key: '/check-in', label: <Link href='/check-in'>Check In</Link>});
  }

  if (user?.isClubAdmin || user?.isAdmin) {
    menuItems.push({key: '/club-days', label: <Link href='/club-days'>Club Days</Link>});
  }

  if (user?.isAdmin) {
    menuItems.push(
      {key: '/clubs', label: <Link href='/clubs'>Clubs</Link>},
      {key: '/users', label: <Link href='/users'>Users</Link>},
    )
  }

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Menu style={{width: '100%'}} theme='dark' mode='horizontal' items={menuItems} />
      {/* <Menu style={{width: '100%'}} theme='dark' mode='horizontal'> */}
        {/* <Menu.Item key='/'> */}
        {/*   <Link href='/'> */}
        {/*     Home */}
        {/*   </Link> */}
        {/* </Menu.Item> */}

        {/* {user && ( */}
        {/*   <Menu.Item key='/check-in'> */}
        {/*     <Link href='/check-in'> */}
        {/*       Check In */}
        {/*     </Link> */}
        {/*   </Menu.Item> */}
        {/* )} */}

        {/* {(user?.isClubAdmin || user?.isAdmin) && ( */}
        {/*   <Menu.Item key='/club-days'> */}
        {/*     <Link href='/club-days'> */}
        {/*       Club Days */}
        {/*     </Link> */}
        {/*   </Menu.Item> */}
        {/* )} */}

        {/* {user?.isAdmin && ( */}
        {/*   <> */}
        {/*     <Menu.Item key='/clubs'> */}
        {/*       <Link href='/clubs'> */}
        {/*         Clubs */}
        {/*       </Link> */}
        {/*     </Menu.Item> */}
        {/**/}
        {/*     <Menu.Item key='/users'> */}
        {/*       <Link href='/users'> */}
        {/*         Users */}
        {/*       </Link> */}
        {/*     </Menu.Item> */}
        {/*   </> */}
        {/* )} */}
      {/* </Menu> */}

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

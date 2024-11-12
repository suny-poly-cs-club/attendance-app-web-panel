import Button from 'antd/es/button';
import Divider from 'antd/es/divider';
import Input from 'antd/es/input';
import List from 'antd/es/list';
import Modal from 'antd/es/modal';
import Popconfirm from 'antd/es/popconfirm';
import {type FC, useEffect, useState} from 'react';
const {Search} = Input;

import {type AuthUser, useAuth, useRest} from '../providers/auth';
import type {Club} from '../rest';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  club: Club;
};

const ManageClubAdminsModal: FC<Props> = ({club, open, setOpen}) => {
  const rest = useRest();

  const [isSearching, setIsSearching] = useState(false);
  const [currentAdmins, setCurrentAdmins] = useState<AuthUser[]>([]);
  const [searchResults, setSearchResults] = useState<AuthUser[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const {user: me} = useAuth();

  useEffect(() => {
    if (open) {
      setLoading(true);
      console.log('getting admins');
      rest
        .getClubAdmins(club.id)
        .then(admins => setCurrentAdmins(admins))
        .finally(() => setLoading(false));
    }
  }, [open, club, rest]);

  const getUsers = async () => {
    setLoading(true);

    const users = await rest.getAllUsers().finally(() => setLoading(false));

    setUsers(users);
    return users;
  };

  const onSearch = (query: string) => {
    // TODO: query the database instead of downloading all users
    const normalize = (q: string) => q.toLowerCase().replace(/[^a-z]/g, '');

    const q = normalize(query);
    setIsSearching(!!q);

    if (!q) {
      return;
    }

    setSearchLoading(true);
    // TODO: there's gotta be a better way LOL
    (users?.length ? Promise.resolve(users) : getUsers()).then(users => {
      setSearchLoading(false);
      const results = users.filter(u =>
        normalize(u.firstName + u.lastName + u.email).includes(q)
      );

      setSearchResults(results);
    });
  };

  const addAdmin = (user: AuthUser) => {
    // optimistically add the user to the admin list
    setCurrentAdmins([...currentAdmins, user]);
    rest.addClubAdmin(club.id, user.id).catch(() => {
      setCurrentAdmins(a => a.filter(ca => ca.id !== user.id));
    });
  };

  const removeAdmin = (user: AuthUser) => {
    const oldAdmins = [...currentAdmins];
    setCurrentAdmins(a => a.filter(ca => ca.id !== user.id));
    rest.removeClubAdmin(club.id, user.id).catch(() => {
      setCurrentAdmins(oldAdmins);
    });
  };

  return (
    <Modal
      title='Manage Club Admins'
      open={open}
      footer={[
        <Button
          type='default'
          onClick={() => setOpen(false)}
          key='close_button'
        >
          Close
        </Button>,
      ]}
      onCancel={() => setOpen(false)}
    >
      <Search
        placeholder='Search for users...'
        onSearch={onSearch}
        loading={searchLoading}
        // value={searchValue}
      />

      <Divider>
        <div>{isSearching ? 'Search Results' : 'Club Admins'}</div>
      </Divider>

      <List
        loading={isLoading}
        dataSource={isSearching ? searchResults : currentAdmins}
        renderItem={item => (
          <List.Item
            actions={[
              currentAdmins.some(c => c.id === item.id) ? (
                <Popconfirm
                  title='Remove Admin'
                  description={`Are you sure you want to remove ${item.firstName} ${item.lastName} as an admin from this club?`}
                  onConfirm={() => removeAdmin(item)}
                  key={item.id}
                >
                  <Button
                    danger
                    disabled={item.isAdmin || item.id === me?.id}
                    type='primary'
                    size='small'
                    title={
                      item.id === me?.id
                        ? 'Cannot remove admin from yourself'
                        : item.isAdmin
                          ? 'User is a Service Admin'
                          : ''
                    }
                  >
                    Remove Admin
                  </Button>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title='Add Admin'
                  description={`Are you sure you want to make ${item.firstName} ${item.lastName} an admin of this club?`}
                  onConfirm={() => addAdmin(item)}
                  key={item.id}
                >
                  <Button type='primary' size='small'>
                    Promote to Admin
                  </Button>
                </Popconfirm>
              ),
            ]}
          >
            <p>
              {item.firstName} {item.lastName}
            </p>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default ManageClubAdminsModal;

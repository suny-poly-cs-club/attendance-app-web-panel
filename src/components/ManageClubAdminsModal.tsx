import {FC, useEffect, useState} from 'react';
import {Button, Divider, Input, List, Modal, Popconfirm, Skeleton} from 'antd';
const {Search} = Input;

import {AuthUser, useRest} from '../providers/auth';
import styles from '../pages/ClubDays.module.css';
import {Club} from '../rest';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  club: Club;
};

export const ManageClubAdminsModal: FC<Props> = ({club, open, setOpen}) => {
  const rest = useRest();

  const [isSearching, setIsSearching] = useState(false);
  const [currentAdmins, setCurrentAdmins] = useState<AuthUser[]>([]);
  const [searchResults, setSearchResults] = useState<AuthUser[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      console.log('getting admins')
      rest.getClubAdmins(club.id)
      .then(admins => setCurrentAdmins(admins))
      .finally(() => setLoading(false));
    }
  }, [open, club])

  const getUsers = async () => {
    setLoading(true);
    console.log('getting users')
    const users = await rest.getAllUsers()
      // .then(users => (setUsers(users)))
      .finally(() => setLoading(false));
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
    (users?.length ? Promise.resolve(users) : getUsers()).then(users=> {
      setSearchLoading(false);
      const results = users.filter(
        u =>
          normalize(u.firstName+u.lastName+u.email)
          .includes(q)
      );

      setSearchResults(results);
    });
  };

  const addAdmin = (user: AuthUser) => {
    // optimistically add the user to the admin list
    setCurrentAdmins([...currentAdmins, user]);
    rest.addClubAdmin(club.id, user.id)
      .catch(() => {
        setCurrentAdmins(a => a.filter(ca => ca.id !== user.id));
      });
  };

  const removeAdmin = (user: AuthUser) => {
    setCurrentAdmins(a => a.filter(ca => ca.id !== user.id));
    rest.removeClubAdmin(club.id, user.id)
      .catch(() => {
        setCurrentAdmins([...currentAdmins, user]);
      });
  };

  return (
    <Modal
      title="Manage Club Admins"
      open={open}
      footer={[
        <Button
          type="default"
          onClick={() => setOpen(false)}
          key="close_button"
        >
          Close
        </Button>,
      ]}
      onCancel={() => setOpen(false)}
    >
      <Search
        placeholder="Search for users..."
        onSearch={onSearch}
        loading={searchLoading}
        // value={searchValue}
      />

      <Divider>
        <div>{isSearching ? "Search Results" : "Club Admins"}</div>
      </Divider>

      <List
        loading={isLoading}
        dataSource={isSearching ? searchResults : currentAdmins}
        renderItem={item => (
          <List.Item
            actions={[
              currentAdmins.some(c => c.id === item.id)
                ? (
                  <Popconfirm
                    title="Remove Admin"
                    description={`Are you sure you want to remove ${item.firstName} ${item.lastName} as an admin from this club?`}
                    onConfirm={() => removeAdmin(item)}
                  >
                    <Button danger type="primary" size="small">Remove Admin</Button>
                  </Popconfirm>
                )

                : (
                  <Popconfirm
                    title="Add Admin"
                    description={`Are you sure you want to make ${item.firstName} ${item.lastName} an admin of this club?`}
                    onConfirm={() => addAdmin(item)}
                  >
                    <Button type="primary" size="small">Promote to Admin</Button>
                  </Popconfirm>
                )
            ]}
          >
            <p>{item.firstName} {item.lastName}</p>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export const AddClubAdminsModal: FC<Props> = ({club, open, setOpen}) => {
  const rest = useRest();

  const [admins, setAdmins] = useState<AuthUser[]>([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    //(in rest) get the user list here. but dont becaus they have to search
    //rest.getAttendees(clubDay.id).then(a => setAttendees(a));
  }, [open]);

  function updateList(input: string) {
    rest.searchUsers(input).then(users => setAdmins(users));
  }


  return (
    <>
      <Modal
        open={open}
        footer={[
          <Button
            type="primary"
            onClick={() => setOpen(false)}
            key="close_button"
          >
            Close
          </Button>,
        ]}
        onCancel={() => setOpen(false)}
      >
        <div>
          {/*search bar here*/}
          <input placeholder={"Search"} onChange={(event)=>{updateList(event.target.value);}} className={styles.addClubAdminsSearchBox}/>
          <div className={styles.clubAdminUserList}>
            <h3>Name</h3>
            <h3>Actions</h3>
          </div>
          {admins.length ? (
            admins.map((a, i) => (
              <p key={i} className={styles.clubAdminUserList}>
                {a.firstName} {a.lastName}
                <Button  onClick={() =>{
                  rest.addClubAdmin(club.id, a.id);
                }}> Add </Button>
              </p>
              //add button here
            ))
          ) : (
              <p>No Users Found</p>
            )}
        </div>
      </Modal>
    </>
  );
};

export const RemoveClubAdminsModal: FC<Props> = ({club, open, setOpen}) => {
  const rest = useRest();

  const [admins, setAdmins] = useState<AuthUser[]>([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    //(in rest) get the admins list here
    rest.getClubAdmins(club.id).then(a => setAdmins(a));
  }, [ open]);

  return (
    <>
      <Modal
        open={open}
        footer={[
          <Button
            type="primary"
            onClick={() => setOpen(false)}
            key="close_button"
          >
            Close
          </Button>,
        ]}
        onCancel={() => setOpen(false)}
      >
        <div>
          <br></br>
          <div className={styles.clubAdminUserList}>
            <h3>Name</h3>
            <h3>Actions</h3>
          </div>
          {admins.length ? (
            admins.map((a, i) => (
              <p key={i} className={styles.clubAdminUserList}>
                {a.firstName} {a.lastName}
                <Popconfirm
                  title="Remove Club Admin"
                  description={`Are you sure you want to remove ${a.firstName} ${a.lastName} from club admins?`}
                  onConfirm={() =>{
                    rest.removeClubAdmin(club.id, a.id).then( b => {
                      rest.getClubAdmins(club.id)
                        .then(c => setAdmins(c));
                    });
                    admins.splice(i, 1);
                    setAdmins(admins);
                  }}
                >
                  <Button danger> Remove </Button>
                </Popconfirm>
              </p>
              //remove button here

            ))
          ) : (
              <p>No one is admin of this club</p>
            )}
        </div>
      </Modal>
    </>
  );
};

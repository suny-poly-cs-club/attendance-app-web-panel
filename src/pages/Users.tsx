import {type FC, useEffect, useState} from 'react';
import {Space, Table, type TableColumnsType} from 'antd';

import {type AuthUser, useRest} from '../providers/auth';
import styles from './ClubDays.module.css';
import UserServiceAdminButton from '../components/UserServiceAdminButton.tsx';

type UserTableData = AuthUser & {
  key: number;
};

const UsersPage: FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const rest = useRest();
  const [data, setData] = useState<UserTableData[]>([]);

  const [update, _setUpdate] = useState(false);
  const forceReloadData = () => _setUpdate(s => !s);

  useEffect(() => {
    rest
      .getAllUsers()
      .then(data => {
        const mappedData: UserTableData[] = data.map((d: AuthUser) => ({
          ...d,
          key: d.id,
        }));
        setData(mappedData);
      })
      .finally(() => setIsLoading(false));
    update;
  }, [update, rest]);

  const columns: TableColumnsType<UserTableData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },

    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (_, user) => <p>{user.firstName}</p>,
    },
    {
      title: 'last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (_, user) => <p>{user.lastName}</p>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (_, user) => <p>{user.email}</p>,
    },

    {
      title: 'Actions',
      key: 'actions',
      render: (_, user) => (
        <>
          <Space>
            {/*}
                    <QRDisplayModalButton clubDay={day} />

                    <ViewAttendeesButton clubDay={day} />
*/}
            <UserServiceAdminButton user={user} rerender={forceReloadData} />
          </Space>
        </>
      ),
    },
  ];

  return (
    <>
      <div className={styles.createButtonContainer}>
        <h1>Users</h1>
      </div>

      <Table columns={columns} dataSource={data} loading={isLoading} />
    </>
  );
};

export default UsersPage;

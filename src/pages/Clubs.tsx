import {FC, useEffect, useState} from 'react';
import {Space, Table, TableColumnsType} from 'antd';

import { useRest} from '../providers/auth';
import styles from './ClubDays.module.css';
import CreateClubButton from '../components/CreateClub.tsx'
import DeleteClubButton from '../components/DeleteClubButton.tsx'

type Club = {
    id: number;
    name: string;
};

type ClubTableData = Club & {
    key: number;
};

const ClubsPage: FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    const rest = useRest();
    const [data, setData] = useState<ClubTableData[]>([]);
    
    const [update, _setUpdate] = useState(false);
    const forceReloadData = () => _setUpdate(s => !s);
    
    useEffect(() => {
        rest
      .getAllClubs()
      .then(data => {
          const mappedData: ClubTableData[] = data.map((d: Club) => ({
              ...d,
              key: d.id,
          }));
          setData(mappedData);
      })
      .finally(() => setIsLoading(false));
    }, [update]);
    
    const columns: TableColumnsType<ClubTableData> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },

        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, day) => (
                <p>{day.name}</p>
                ),
        },

        {
            title: 'Actions',
            key: 'actions',
            render: (_, day) => (
                <>
                <Space>{/*}
                    <QRDisplayModalButton clubDay={day} />

                    <ViewAttendeesButton clubDay={day} />
*/}
                    <DeleteClubButton clubId={day} rerender={forceReloadData} />
                    
                </Space>
                </>
                ),
        },
    ];
    
    
    return (
        <>
            <div className={styles.createButtonContainer}>
                <h1>Clubs</h1>

                <div>
                    <CreateClubButton rerender={forceReloadData} />
                </div>
            </div>


            <Table columns={columns} dataSource={data} loading={isLoading} />
        </>
    )
};

export default ClubsPage
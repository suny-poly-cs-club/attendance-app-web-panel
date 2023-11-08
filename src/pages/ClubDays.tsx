import {FC, useEffect, useState} from 'react';
import {Space, Table, TableColumnsType} from 'antd';
import dayjs from 'dayjs';

import {ClubDay} from '../rest';
import {useRest} from '../providers/auth';
import ViewAttendeesButton from '../components/ViewAttendees';
import DeleteClubDayButton from '../components/DeleteClubDayButton';

import styles from './ClubDays.module.css';
import CreateClubDayButton from '../components/CreateClubDay';
import QRDisplayModalButton from '../components/QRModal';

type ClubDayTableData = ClubDay & {
  key: number;
  formatted_starts_at: string;
  formatted_ends_at: string;
};

const ClubDaysPage: FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const rest = useRest();
  const [data, setData] = useState<ClubDayTableData[]>([]);

  const [update, _setUpdate] = useState(false);
  const forceReloadData = () => _setUpdate(s => !s);

  useEffect(() => {
    rest
      .getClubDays()
      .then(data => {
        const mappedData = data.map(d => ({
          ...d,
          key: d.id,
          formatted_starts_at: dayjs(d.starts_at).format('LLLL'),
          formatted_ends_at: dayjs(d.ends_at).format('LLLL'),
        }));
        setData(mappedData);
      })
      .finally(() => setIsLoading(false));
  }, [update]);

  const columns: TableColumnsType<ClubDayTableData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },

    {
      title: 'Starts At',
      dataIndex: 'starts_at',
      key: 'starts_at',
      render: (_, day) => (
        <time dateTime={day.starts_at}>{day.formatted_starts_at}</time>
      ),
    },

    {
      title: 'Ends At',
      dataIndex: 'ends_at',
      key: 'ends_at',
      render: (_, day) => (
        <time dateTime={day.ends_at}>{day.formatted_ends_at}</time>
      ),
    },

    {
      title: 'Attendees',
      key: 'attendees',
      dataIndex: 'attendees',
    },

    {
      title: 'Actions',
      key: 'actions',
      render: (_, day) => (
        <>
          <Space>
            <QRDisplayModalButton clubDay={day} />

            <ViewAttendeesButton clubDay={day} />

            <DeleteClubDayButton clubDay={day} rerender={forceReloadData} />
          </Space>
        </>
      ),
    },
  ];

  return (
    <>
      <div className={styles.createButtonContainer}>
        <h1>Club Days</h1>

        <div>
          <CreateClubDayButton rerender={forceReloadData} />
        </div>
      </div>

      <Table columns={columns} dataSource={data} loading={isLoading} />
    </>
  );
};

export default ClubDaysPage;

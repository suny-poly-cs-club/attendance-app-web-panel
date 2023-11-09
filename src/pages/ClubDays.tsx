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
  formattedStartsAt: string;
  formattedEndsAt: string;
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
          formattedStartsAt: dayjs(d.startsAt).format('LLLL'),
          formattedEndsAt: dayjs(d.endsAt).format('LLLL'),
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
      dataIndex: 'startsAt',
      key: 'startsAt',
      render: (_, day) => (
        <time dateTime={day.startsAt}>{day.formattedStartsAt}</time>
      ),
    },

    {
      title: 'Ends At',
      dataIndex: 'endsAt',
      key: 'endsAt',
      render: (_, day) => (
        <time dateTime={day.endsAt}>{day.formattedEndsAt}</time>
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

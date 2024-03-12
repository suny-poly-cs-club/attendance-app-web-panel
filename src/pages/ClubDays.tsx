import {FC, useEffect, useState} from 'react';
import {Flex, Space, Table, TableColumnsType, Select, Row, Col} from 'antd';
import dayjs from 'dayjs';

import {ClubDay} from '../rest';
import {useRest} from '../providers/auth';
import ViewAttendeesButton from '../components/ViewAttendees';
import DeleteClubDayButton from '../components/DeleteClubDayButton';

import styles from './ClubDays.module.css';
import CreateClubDayButton from '../components/CreateClubDay';
import QRDisplayModalButton from '../components/QRModal';

import {AddClubAdminButton, RemoveClubAdminButton} from '../components/ManageClubAdmins.tsx'

type ClubDayTableData = ClubDay & {
  key: number;
  formattedStartsAt: string;
  formattedEndsAt: string;
};

type Club = {
  id: number;
  name: string;
};

type DropDownProps = {
  onSelect: (club: Club) => void;
};


const ClubsDropdown: FC<DropDownProps> =  ({onSelect}) => {
  const rest = useRest();
  const [clubList, setClubList] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<number | null>(null);

  useEffect(() => {
    rest.getClubs()
      .then(clubs => {
        setClubList(clubs);
        setSelectedClub(clubs[0].id);
      });
  }, []);

  const onChange = (value: number) => {
    const club = clubList.find(c => c.id === value)!;
    setSelectedClub(value);
    onSelect(club);
    rest.setSelectedClub(value)
  };

  return (
    <Select
      className={styles.clubDropdownContainer}
      showSearch
      placeholder="Select a Club"
      optionFilterProp="children"
      onChange={onChange}
      options={clubList.map(c => ({label: c.name, value: c.id}))}
      value={selectedClub}
    />
  )
}

const ClubDaysPage: FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const rest = useRest();
  const [data, setData] = useState<ClubDayTableData[]>([]);
  // FIXME: null! is bad lol
  const [selectedClub, setSelectedClub] = useState<Club>(null!);

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
  }, [update, selectedClub]);

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
      <Flex align="center" justify="space-between">
        <h1>Manage Club Days</h1>
        <CreateClubDayButton rerender={forceReloadData} />
      </Flex>

      <Row align="middle">
        <Col span={8}>
          <h2>Club</h2>
        </Col>

        <Col span={8}>
          <ClubsDropdown onSelect={setSelectedClub} />
        </Col>

        <Col span={8}>
          <Flex gap="small" style={{justifyContent: 'flex-end'}}>
            <AddClubAdminButton />
            <RemoveClubAdminButton />
          </Flex>
        </Col>
      </Row>


      <Table columns={columns} dataSource={data} loading={isLoading} />
    </>
  );
};

export default ClubDaysPage;

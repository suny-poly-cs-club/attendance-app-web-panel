import type {TableColumnsType} from 'antd';
import Col from 'antd/es/col';
import Flex from 'antd/es/flex';
import Row from 'antd/es/row';
import Select from 'antd/es/select';
import Space from 'antd/es/space';
import Table from 'antd/es/table';
import dayjs from 'dayjs';
import {type FC, Suspense, lazy, useEffect, useState} from 'react';
import CreateClubDayButton from '../components/CreateClubDay';
import DeleteClubDayButton from '../components/DeleteClubDayButton';
import ManageClubAdminButton from '../components/ManageClubAdmins.tsx';
import ViewAttendeesButton from '../components/ViewAttendees';
import {useRest} from '../providers/auth';
import type {ClubDay} from '../rest';
import styles from './ClubDays.module.css';

const QRDisplayModalButton = lazy(() => import('../components/QRModal'));

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

const ClubsDropdown: FC<DropDownProps> = ({onSelect}) => {
  const rest = useRest();
  const [clubList, setClubList] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<number | null>(null);

  const onChange = (value: number) => {
    const club = clubList.find(c => c.id === value)!;
    setSelectedClub(value);
    onSelect(club);
  };

  useEffect(() => {
    rest.getClubs().then(clubs => {
      setClubList(clubs);
      setSelectedClub(clubs[0]?.id);
      // TODO: is there a better way to do this?
      onSelect(clubs?.[0]);
    });
  }, [rest, onSelect]);

  return (
    <Select
      className={styles.clubDropdownContainer}
      placeholder='Select a Club'
      optionFilterProp='children'
      onChange={onChange}
      options={clubList.map(c => ({label: c.name, value: c.id}))}
      value={selectedClub}
    />
  );
};

const ClubDaysPage: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const rest = useRest();
  const [data, setData] = useState<ClubDayTableData[]>([]);
  // FIXME: null! is bad lol
  const [selectedClub, setSelectedClub] = useState<Club>(null!);

  const [update, _setUpdate] = useState(false);
  const forceReloadData = () => _setUpdate(s => !s);

  useEffect(() => {
    console.log({selectedClub});
    if (!selectedClub) {
      return;
    }

    setIsLoading(true);

    rest
      .getClubDays(selectedClub.id)
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
    update;
  }, [update, selectedClub, rest]);

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
            <Suspense>
              <QRDisplayModalButton club={selectedClub} clubDay={day} />
            </Suspense>

            <ViewAttendeesButton club={selectedClub} clubDay={day} />

            <DeleteClubDayButton
              club={selectedClub}
              clubDay={day}
              rerender={forceReloadData}
            />
          </Space>
        </>
      ),
    },
  ];

  // FIXME: on a small screen, the dropdown overlaps the manage admin button

  return (
    <>
      <Flex align='center' justify='space-between'>
        <h1>Manage Club Days</h1>
        {selectedClub && (
          <CreateClubDayButton club={selectedClub} rerender={forceReloadData} />
        )}
      </Flex>

      <Row align='middle'>
        <Col span={6}>
          <h2>Club</h2>
        </Col>

        <Col span={12}>
          <ClubsDropdown onSelect={setSelectedClub} />
        </Col>

        <Col span={6}>
          <Flex gap='small' style={{justifyContent: 'flex-end'}}>
            {selectedClub && <ManageClubAdminButton club={selectedClub} />}
          </Flex>
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} loading={isLoading} />
    </>
  );
};

export default ClubDaysPage;

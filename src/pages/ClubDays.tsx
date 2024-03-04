import React, {FC, useEffect, useState} from 'react';
import {Space, Table, TableColumnsType} from 'antd';
import dayjs from 'dayjs';

import {ClubDay} from '../rest';
import {useRest} from '../providers/auth';
import ViewAttendeesButton from '../components/ViewAttendees';
import DeleteClubDayButton from '../components/DeleteClubDayButton';

import styles from './ClubDays.module.css';
import CreateClubDayButton from '../components/CreateClubDay';
import QRDisplayModalButton from '../components/QRModal';

import {AddClubAdminButton,RemoveClubAdminButton} from '../components/ManageClubAdmins.tsx'

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
  rerender: () => void;
};


const ClubsDropdown: FC<DropDownProps> =  ({rerender}) => {
  const rest = useRest();
  const [options, setOptions] = useState<Club[]>([]);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    const fetchData = async () => {
	//get the list of clubs from the server
      const response = await rest.getClubs();
	  if(response){
		setOptions(response);
		if(response.length!=0){
		//set the initial select optio to the first one on te list
			setSelectedOption(response[0].id);
			rest.setSelectedClub(response[0].id);
			rerender();
		}
	  }
    };

    fetchData();
  }, []);

  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
	//console.log(event.target.value);
    rest.setSelectedClub(Number(event.target.value));
    // Fetch additional data or update content based on selection here
	rerender();
  };

  return (
    <div>
      <select value={selectedOption} onChange={handleOnChange} className={styles.clubDropdownContainer}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {/* Update content based on selectedOption here */}
    </div>
  );
}

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
        <h1>Club</h1>
        
	      <ClubsDropdown rerender={forceReloadData} />
        
        <div className={styles.clubActionButtonContainer}>
          <div className={styles.clubActionButton}>
            <AddClubAdminButton />
          </div>
          
          <div className={styles.clubActionButton}>
            <RemoveClubAdminButton />
          </div>
        </div>
      </div>
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

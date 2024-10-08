import {type FC, useEffect, useState} from 'react';
import {Space, Input, Button} from 'antd';

import {useQueryParam} from '../hooks/query';
import {useRest} from '../providers/auth';

const CheckInPage: FC = () => {
  const rest = useRest();
  const code = useQueryParam('code');
  
  const [clubName, setClubName] = useState<string>("");
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  
  if(code){
    useEffect(() => {
	  rest.getClubNameFromCode(code).then(result =>{
	  	setClubName(result.name);
	  }),[code]
    });
    useEffect(() => {
	  rest.getUserCheckedIn(code).then(result =>{
	  	setCheckedIn(result.checkedIn);
	  }),[code]
    });
  }
  return (
    <>
      {code ? (
        <p>code: {code}<br />name: {clubName}<br />checkIn: {checkedIn+""}</p>
      ) : (
          <>
            <h1>Check In</h1>
            <Space.Compact>
              <Input placeholder='put code here' />
              <Button type='primary'>Submit</Button>
            </Space.Compact>
          </>
      )}
    </>
  );
};

export default CheckInPage;

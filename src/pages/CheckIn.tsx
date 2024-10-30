import {type FC, useEffect, useState} from 'react';
import {Space, Input, Button} from 'antd';
import styles from './Home.module.css';
import {useQueryParam} from '../hooks/query';
import {useRest} from '../providers/auth';

const CheckInPage: FC = () => {
  const rest = useRest();
  const code = useQueryParam('code');

  const [clubName, setClubName] = useState<string>('');
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const [codeNotFound, setCodeNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (!code) {
      return;
    }

    rest
      .getClubNameFromCode(code)
      .then(result => {
        setClubName(result.name);
      })
      .catch(e => {
        if (e.code === 404) {
          setCodeNotFound(true);
        }
      }),
      [code, rest];

    rest.getUserCheckedIn(code).then(result => {
      setCheckedIn(result.checkedIn);
    });
  }, [code]);

  function checkIn() {
    if (code != null) {
      rest
        .checkIn(code)
        .then(() => {
          console.log('success');
          setCheckedIn(true); //prbly should show a diffrent message
        })
        .catch(e => {
          alert(e.res.message);
          //console.log(e+" "+e.res.message)
        });
    }
  }

  return (
    <>
      {code && !codeNotFound ? (
        <>
          {checkedIn ? (
            <div className={styles.centered}>
              <h1>You Are Checked in to {clubName}</h1>
            </div>
          ) : (
            <div className={styles.centered}>
              <h1>Check Into {clubName}</h1>
              <Button type='primary' onClick={() => checkIn()}>
                Check In
              </Button>
            </div>
          )}
        </>
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

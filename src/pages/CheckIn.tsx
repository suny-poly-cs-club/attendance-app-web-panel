import {type FC, useCallback, useEffect, useState} from 'react';
import {Flex, Input, Typography} from 'antd';
import homeStyles from './Home.module.css';
import {useQueryParam} from '../hooks/query';
import {useRest} from '../providers/auth';
import CheckedInMessage from '../components/CheckedInMessage';
import {isValidLuhn} from '@benricheson101/util';

const {Text} = Typography;

const CheckInPage: FC = () => {
  const rest = useRest();
  const queryCode = useQueryParam('code');

  const [clubName, setClubName] = useState<string>('');
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const [inputStatus, setInputStatus] = useState<'' | 'warning' | 'error'>('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const checkIn = useCallback(async (code: string) => {
    if (!code) {
      return;
    }

    const isInvalid = !/^\d{6}$/.test(code) || !isValidLuhn(Number(code));
    if (isInvalid) {
      setInputStatus('warning');
      setErrorMsg('invalid code');
      return;
    }

    try {
      const club = await rest.checkIn(code);
      setClubName(club.name);
    } catch (err) {
      setInputStatus('error');
      setErrorMsg('check in failed');
      return;
    }

    setInputStatus('');
    setCheckedIn(true);
  }, [rest]);


  useEffect(() => {
    if (!queryCode) {
      return;
    }

    checkIn(queryCode)
  }, [queryCode, checkIn]);

  const onSubmit = async (code: string) => {
    setInputDisabled(true);
    await checkIn(code);
    setInputDisabled(false);
  };

  const [prevInput, setPrevInput] = useState<string[]>([]);

  // FIXME: if you don't put in a digit, this erases it but also moves the focus to the next box. is there a way to make it keep the focus?
  /** ensures each input field is a digit */
  const onInput = (input: string[]) => {
    for (const i in input) {
      if (input[i] < '0' || input[i] > '9') {
        input[i] = '';
      }
    }

    const changed = input.length !== prevInput.length || !input.every((a, i) => a === prevInput[i]);

    if (changed) {
      setErrorMsg('');
      setInputStatus('');
    }

    setPrevInput(input)
  };

  return (
    <div className={homeStyles.centered}>
      {checkedIn && clubName
        ? (<CheckedInMessage clubName={clubName} />)
        : (
          <>
            <h1>Check In</h1>
            <h2>Enter Check-In Code</h2>
            <Flex vertical>
              <Input.OTP
                autoFocus
                length={6}
                onChange={onSubmit}
                onInput={onInput}
                status={inputStatus}
                disabled={inputDisabled}
              />
              {!!errorMsg && <Text type={inputStatus === 'error' ? 'danger' : 'warning'}>{errorMsg}</Text>}
            </Flex>
          </>
        )
      }
    </div>
  )
};

export default CheckInPage;

import type {FC} from 'react';
import {useQueryParam} from '../hooks/query';

const CheckInPage: FC = () => {
  const code = useQueryParam('code');

  return (
    <>
      {code
        ? <p>code: {code}</p>
        : <input type="text" placeholder="type code here"/>
      }
    </>
  );
};

export default CheckInPage;

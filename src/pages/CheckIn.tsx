import type {FC} from 'react';
import {Space, Input, Button} from 'antd';

import {useQueryParam} from '../hooks/query';

const CheckInPage: FC = () => {
  const code = useQueryParam('code');

  return (
    <>
      {code ? (
        <p>code: {code}</p>
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

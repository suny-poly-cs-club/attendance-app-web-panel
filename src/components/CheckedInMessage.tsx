import type {FC} from 'react';
import {Result} from 'antd';

type Props = {
  clubName: string;
};

const CheckedInMessage: FC<Props> = ({clubName}) => {
  return (
    <Result
      status='success'
      title="You're Checked In!"
      subTitle={<>Successfully checked you in to the <b>{clubName}</b> club!</>}
    />
  )
};

export default CheckedInMessage;

import Result from 'antd/es/result';
import type {FC} from 'react';

type Props = {
  clubName: string;
};

const CheckedInMessage: FC<Props> = ({clubName}) => {
  return (
    <Result
      status='success'
      title="You're Checked In!"
      subTitle={
        <>
          Successfully checked you in to the <b>{clubName}</b> club!
        </>
      }
    />
  );
};

export default CheckedInMessage;

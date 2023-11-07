import {Button} from 'antd';
import {FC, useCallback, useState} from 'react';
import {ClubDay} from '../rest';
import ViewAttendeesModal from './ViewAttendeesModal';

type Props = {
  clubDay: ClubDay;
};

const ViewAttendeesButton: FC<Props> = ({clubDay}) => {
  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    setOpen(true);
  }, [clubDay]);

  return (
    <>
      <Button type="primary" onClick={onClick}>
        View Attendees
      </Button>
      <ViewAttendeesModal open={open} setOpen={setOpen} clubDay={clubDay} />
    </>
  );
};

export default ViewAttendeesButton;

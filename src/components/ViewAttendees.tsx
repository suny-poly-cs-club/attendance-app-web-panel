import {Button} from 'antd';
import {FC, useCallback, useState} from 'react';
import {Club, ClubDay} from '../rest';
import ViewAttendeesModal from './ViewAttendeesModal';

type Props = {
  club: Club;
  clubDay: ClubDay;
};

const ViewAttendeesButton: FC<Props> = ({club, clubDay}) => {
  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    setOpen(true);
  }, [clubDay]);

  return (
    <>
      <Button type="primary" onClick={onClick}>
        View Attendees
      </Button>
      <ViewAttendeesModal open={open} setOpen={setOpen} clubDay={clubDay} club={club} />
    </>
  );
};

export default ViewAttendeesButton;

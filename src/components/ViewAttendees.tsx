import {Button} from 'antd';
import {type FC, useState} from 'react';
import type {Club, ClubDay} from '../rest';
import ViewAttendeesModal from './ViewAttendeesModal';

type Props = {
  club: Club;
  clubDay: ClubDay;
};

const ViewAttendeesButton: FC<Props> = ({club, clubDay}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type='primary' onClick={() => setOpen(true)}>
        View Attendees
      </Button>
      <ViewAttendeesModal
        open={open}
        setOpen={setOpen}
        clubDay={clubDay}
        club={club}
      />
    </>
  );
};

export default ViewAttendeesButton;

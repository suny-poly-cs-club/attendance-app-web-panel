import {FC, useEffect, useState} from 'react';
import {AuthUser, useRest} from '../providers/auth';
import {ClubDay} from '../rest';
import {Button, Modal} from 'antd';
import {downloadFile} from '../util/download';

type Props = {
  clubDay: ClubDay;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ViewAttendeesModal: FC<Props> = ({clubDay, open, setOpen}) => {
  const rest = useRest();

  const [attendees, setAttendees] = useState<AuthUser[]>([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    rest.getAttendees(clubDay.id).then(a => setAttendees(a));
  }, [clubDay, open]);

  return (
    <>
      <Modal
        open={open}
        footer={[
          attendees.length > 0 && (
            <Button
              type="default"
              onClick={() => {
                downloadFile('attendance.json', {
                  data: JSON.stringify(attendees, null, 2),
                  type: 'application/json',
                });
              }}
              key="download_button"
            >
              Download JSON
            </Button>
          ),

          <Button
            type="primary"
            onClick={() => setOpen(false)}
            key="close_button"
          >
            Close
          </Button>,
        ]}
        onCancel={() => setOpen(false)}
      >
        <div>
          {attendees.length ? (
            attendees.map((a, i) => (
              <p key={i}>
                {a.firstName} {a.lastName}
              </p>
            ))
          ) : (
            <p>No one attended this club session!</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ViewAttendeesModal;

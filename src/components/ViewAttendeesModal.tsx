import Button from 'antd/es/button';
import Modal from 'antd/es/modal';
import {type FC, useEffect, useState} from 'react';
import {type AuthUser, useRest} from '../providers/auth';
import type {Club, ClubDay} from '../rest';
import {downloadFile} from '../util/download';

type Props = {
  club: Club;
  clubDay: ClubDay;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ViewAttendeesModal: FC<Props> = ({club, clubDay, open, setOpen}) => {
  const rest = useRest();

  const [attendees, setAttendees] = useState<AuthUser[]>([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    rest.getAttendees(club.id, clubDay.id).then(a => setAttendees(a));
  }, [club, clubDay, open, rest]);

  return (
    <>
      <Modal
        open={open}
        footer={() => [
          ...(attendees.length > 0
            ? [
                <Button
                  type='default'
                  onClick={() => {
                    downloadFile('attendance.txt', {
                      data: attendees
                        .map(a => `${a.firstName} ${a.lastName}`)
                        .join('\n'),
                      type: 'application/json',
                    });
                  }}
                  key='download_txt'
                >
                  Download Attendees
                </Button>,
                <Button
                  type='default'
                  onClick={() => {
                    downloadFile('attendance.json', {
                      data: JSON.stringify(attendees, null, 2),
                      type: 'application/json',
                    });
                  }}
                  key='download_json'
                >
                  Download JSON
                </Button>,
              ]
            : []),

          <Button
            type='primary'
            onClick={() => setOpen(false)}
            key='close_button'
          >
            Close
          </Button>,
        ]}
        onCancel={() => setOpen(false)}
      >
        <div>
          {attendees.length ? (
            attendees.map(a => (
              <p style={{margin: 0}} key={a.id}>
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

import Button from 'antd/es/button';
import Modal from 'antd/es/modal';
import qr from 'qrcode';
import {type FC, useEffect, useRef, useState} from 'react';
import homeStyles from '../pages/Home.module.css';
import {useRest} from '../providers/auth';
import type {Club, ClubDay} from '../rest';
import styles from './QRModal.module.css';

type ButtonProps = {
  club: Club;
  clubDay: ClubDay;
};

const QRDisplayModalButton: FC<ButtonProps> = ({club, clubDay}) => {
  const [open, setOpen] = useState(false);

  const onCancel = () => {
    setOpen(false);
  };

  const starts = new Date(clubDay.startsAt);
  const ends = new Date(clubDay.endsAt);

  return (
    <>
      <Button
        disabled={starts.getTime() > Date.now() || ends.getTime() < Date.now()}
        onClick={() => setOpen(true)}
      >
        Open QR
      </Button>
      <QRDisplayModal
        club={club}
        clubDay={clubDay}
        open={open}
        onCancel={onCancel}
      />
    </>
  );
};

type ModalProps = {
  club: Club;
  clubDay: ClubDay;
  open: boolean;
  onCancel: () => void;
};

const QRDisplayModal: FC<ModalProps> = ({club, clubDay, open, onCancel}) => {
  const rest = useRest();
  const ref = useRef<HTMLImageElement>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [checkInCode, setCheckInCode] = useState<string>('');

  useEffect(() => {
    if (!open) {
      return;
    }

    rest.getClubDayQRToken(club.id, clubDay.id).then(token => {
      setCheckInCode(token.token);

      // TODO: this isn't necessarily safe to use, like if the application is on a sub-path reverse proxy. but that's probably okay
      qr.toString(
        `${window.location.protocol}//${window.location.host}/check-in?code=${token.token}`,
        {type: 'svg'}
      ).then(qrSvg => {
        const dataURL = `data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`;
        setQrData(dataURL);
      });
    });
  }, [clubDay, open, rest, club]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={[
        <Button
          key='print'
          type='default'
          onClick={() => {
            print();
          }}
        >
          Print
        </Button>,

        <Button
          key='fullscreen'
          type='default'
          onClick={() => {
            ref.current?.requestFullscreen();
          }}
        >
          Fullscreen
        </Button>,

        <Button
          key='close'
          type='primary'
          onClick={() => {
            onCancel();
          }}
        >
          Close
        </Button>,
      ]}
    >
      {qrData && (
        <div className={`${styles.qrCode} ${homeStyles.centered}`}>
          <img alt='QR code' ref={ref} src={qrData} />
          <h1 className={styles.code}>{checkInCode}</h1>
        </div>
      )}
    </Modal>
  );
};

export default QRDisplayModalButton;

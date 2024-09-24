import {Button} from 'antd';
import {type FC, useState} from 'react';
import CreateClubDayModal from './CreateClubDayModal';
import {useRest} from '../providers/auth';
import type {Dayjs} from 'dayjs';
import type {Club} from '../rest';

type Props = {
  rerender: () => void;
  club: Club;
};

const CreateClubDayButton: FC<Props> = ({club, rerender}) => {
  const rest = useRest();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onCreate = async ({range}: {range: [Dayjs, Dayjs]}) => {
    setConfirmLoading(true);

    const startsAt = range[0].toDate();
    const endsAt = range[1].toDate();

    console.log(await rest.createClubDay(club.id, startsAt, endsAt));

    rerender();

    setConfirmLoading(false);
    setOpen(false);
  };

  const onCancel = () => setOpen(false);

  return (
    <>
      <Button type='primary' onClick={() => setOpen(true)}>
        Create Club Day
      </Button>

      <CreateClubDayModal
        open={open}
        onCreate={onCreate}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      />
    </>
  );
};

export default CreateClubDayButton;

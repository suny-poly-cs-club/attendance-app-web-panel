import Button from 'antd/es/button';
import {type FC, useState} from 'react';
import {useRest} from '../providers/auth';
import type {Club} from '../rest';
import CreateClubModal from './CreateClubModal';

type ClubTableData = Club & {key: number};

type Props = {
  setClubs: (f: (clubs: ClubTableData[]) => ClubTableData[]) => void;
};

type CreateClubFormData = {
  name: string;
};

const CreateClubButton: FC<Props> = ({setClubs}) => {
  const rest = useRest();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onCreate = async (data: CreateClubFormData) => {
    setConfirmLoading(true);

    await rest
      .createClub(data.name)
      .then(c => setClubs(clubs => clubs.concat({...c, key: c.id})));

    setConfirmLoading(false);
    setOpen(false);
  };

  const onCancel = () => setOpen(false);

  return (
    <>
      <Button type='primary' onClick={() => setOpen(true)}>
        Create Club
      </Button>

      <CreateClubModal
        open={open}
        onCreate={onCreate}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      />
    </>
  );
};

export default CreateClubButton;

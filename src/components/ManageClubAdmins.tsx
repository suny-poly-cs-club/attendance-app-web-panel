import Button from 'antd/es/button';
import {type FC, useCallback, useState} from 'react';
import type {Club} from '../rest.ts';
import ManageClubAdminsModal from './ManageClubAdminsModal.tsx';

type Props = {
  club: Club;
};

const ManageClubAdminButton: FC<Props> = ({club}) => {
  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <Button type='primary' onClick={onClick}>
        Manage Admins
      </Button>
      <ManageClubAdminsModal club={club} open={open} setOpen={setOpen} />
    </>
  );
};

export default ManageClubAdminButton;

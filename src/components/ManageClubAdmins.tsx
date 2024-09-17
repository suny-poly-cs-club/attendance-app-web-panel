import {Button} from 'antd';
import {type FC, useCallback, useState} from 'react';
import {ManageClubAdminsModal} from './ManageClubAdminsModal.tsx';
import type {Club} from '../rest.ts';

type Props = {
  club: Club;
};

export const ManageClubAdminButton: FC<Props> = ({club}) => {
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

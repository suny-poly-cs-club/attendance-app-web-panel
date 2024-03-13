import {Button} from 'antd';
import {FC, useCallback, useState} from 'react';
//import {ClubDay} from '../rest';
import {AddClubAdminsModal,ManageClubAdminsModal,RemoveClubAdminsModal} from './ManageClubAdminsModal.tsx'
import { Club } from '../rest.ts';

type Props = {
  club: Club;
};

export const ManageClubAdminButton: FC<Props> = ({club}) => {
  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    setOpen(true);
  },[]);

  return (
    <>
      <Button type="primary" onClick={onClick}>
        Manage Admins
      </Button>
      <ManageClubAdminsModal club={club} open={open} setOpen={setOpen} />
    </>
  );
};

export const AddClubAdminButton: FC<Props> = ({club}) => {
  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    setOpen(true);
  },[]);

  return (
    <>
      <Button type="primary" onClick={onClick}>
        Add Admins
      </Button>
      <AddClubAdminsModal club={club} open={open} setOpen={setOpen} />
    </>
  );
};

export const RemoveClubAdminButton: FC<Props> = ({club}) => {
  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <Button danger onClick={onClick}>
        Remove Admins
      </Button>
      <RemoveClubAdminsModal club={club} open={open} setOpen={setOpen}  />
    </>
  );
};


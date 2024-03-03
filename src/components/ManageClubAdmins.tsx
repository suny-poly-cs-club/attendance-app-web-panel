import {Button} from 'antd';
import {FC, useCallback, useState} from 'react';
//import {ClubDay} from '../rest';
import ViewAttendeesModal from './ViewAttendeesModal';
import {AddClubAdminsModal,RemoveClubAdminsModal} from './ManageClubAdminsModal.tsx'

//type Props = {
//    clubDay: ClubDay;
//};

export const AddClubAdminButton: FC = () => {
    const [open, setOpen] = useState(false);

    const onClick = useCallback(() => {
        setOpen(true);
        },[]);

    return (
        <>
        <Button type="primary" onClick={onClick}>
            Add Admins
        </Button>
        <AddClubAdminsModal open={open} setOpen={setOpen} />
        </>
        );
};

export const RemoveClubAdminButton: FC = () => {
    const [open, setOpen] = useState(false);

    const onClick = useCallback(() => {
        setOpen(true);
        }, []);

    return (
        <>
        <Button danger onClick={onClick}>
            Remove Admins
        </Button>
        <RemoveClubAdminsModal open={open} setOpen={setOpen}  />
        </>
        );
};


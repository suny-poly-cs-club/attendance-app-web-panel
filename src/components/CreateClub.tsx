import {Button} from 'antd';
import {FC, useState} from 'react';
import CreateClubModal from './CreateClubModal';
import {useRest} from '../providers/auth';

type Props = {
    rerender: () => void;
};

const CreateClubButton: FC<Props> = ({rerender}) => {
    const rest = useRest();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const onCreate = async (data) => {
        setConfirmLoading(true);
        
        console.log(await rest.createClub(data.name));

        rerender();

        setConfirmLoading(false);
        setOpen(false);
    };

    const onCancel = () => setOpen(false);

    return (
        <>
        <Button type="primary" onClick={() => setOpen(true)}>
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
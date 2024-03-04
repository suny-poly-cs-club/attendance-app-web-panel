import {Button, Popconfirm} from 'antd';
import {FC, useCallback} from 'react';
import {useRest} from '../providers/auth';

type Props = {
    clubId: number;
    rerender: () => void;
};

const DeleteClubButton: FC<Props> = ({clubId, rerender}) => {
    const rest = useRest();

    // TODO: how do I make this rerender the page?

    const confirmDelete = useCallback(async () => {
        await rest.deleteClub(clubId.id).catch(console.error);
        rerender();
        }, [clubId]);

    return (
        <Popconfirm
            title="Delete Club"
            description="Are you sure you want to delete this club?"
            onConfirm={confirmDelete}
            >
            <Button danger>Delete</Button>
        </Popconfirm>
        );
};

export default DeleteClubButton;
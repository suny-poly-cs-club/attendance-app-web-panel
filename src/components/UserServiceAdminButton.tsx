import {Button, Popconfirm} from 'antd';
import {FC, useCallback} from 'react';
import {AuthUser, useRest} from '../providers/auth';

type Props = {
    user: AuthUser;
    rerender: () => void;
};

const UserServiceAdminButton: FC<Props> = ({user, rerender}) => {
    const rest = useRest();
    // TODO: how do I make this rerender the page?

    const confirmRemove = useCallback(async () => {
        await rest.removeServiceAdmin(user.id).catch(console.error);
        rerender();
        }, [user]);
    
    const makeAdmin = useCallback(async () => {
        await rest.makeServiceAdmin(user.id).catch(console.error);
        rerender();
    },[user]
    )

    return (
        <>
        {user?.isAdmin &&(
            <Popconfirm
                title="Remove Admin Access"
                description="Are you sure you want to remove admin access from this user?"
                onConfirm={confirmRemove}
                >
                <Button danger>Remove Admin</Button>
            </Popconfirm>
        )}
        {!user?.isAdmin &&(
            <Button type="primary" onClick={() =>makeAdmin()}>
                Make Admin
            </Button>
        )}    
        </>
        );
};

export default UserServiceAdminButton;
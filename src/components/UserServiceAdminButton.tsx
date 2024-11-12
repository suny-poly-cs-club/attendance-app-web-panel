import Button from 'antd/es/button';
import Popconfirm from 'antd/es/popconfirm';
import {type FC, useCallback} from 'react';
import {type AuthUser, useAuth, useRest} from '../providers/auth';

type Props = {
  user: AuthUser;
  rerender: () => void;
};

const UserServiceAdminButton: FC<Props> = ({user, rerender}) => {
  const rest = useRest();
  const {user: me} = useAuth();
  // TODO: how do I make this rerender the page?

  const confirmRemove = useCallback(async () => {
    await rest.removeServiceAdmin(user.id).catch(console.error);
    rerender();
  }, [user, rerender, rest]);

  const makeAdmin = useCallback(async () => {
    await rest.makeServiceAdmin(user.id).catch(console.error);
    rerender();
  }, [user, rerender, rest]);

  return (
    <>
      {user?.isAdmin ? (
        <Popconfirm
          title='Remove Admin Access'
          description='Are you sure you want to remove admin access from this user?'
          onConfirm={confirmRemove}
        >
          <Button
            danger
            disabled={user.id === me?.id}
            title={
              user.id === me?.id
                ? 'Cannot remove service admin from yourself'
                : ''
            }
          >
            Remove Service Admin
          </Button>
        </Popconfirm>
      ) : (
        <Button type='primary' onClick={() => makeAdmin()}>
          Promote to Service Admin
        </Button>
      )}
    </>
  );
};

export default UserServiceAdminButton;

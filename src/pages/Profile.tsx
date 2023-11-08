import {FC} from 'react';
import {useAuth} from '../providers/auth';

const ProfilePage: FC = () => {
  const {user} = useAuth();

  return (
    <div>
      <p>First Name: {user?.firstName}</p>
      <p>Last Name: {user?.lastName}</p>
      <p>Email: {user?.email}</p>
      <p>Is Admin?: {user?.isAdmin ? 'true' : 'false'}</p>
    </div>
  );
};

export default ProfilePage;

import {FC, useEffect, useState} from 'react';
import {AuthUser, useAuth, useRest} from '../providers/auth';

const ProfilePage: FC = () => {
  // const [user, setUser] = useState<AuthUser>();
  const rest = useRest();

  // useEffect(() => {
  //   console.log(rest);

  //   rest.getUser()
  //     .then(user => (setUser(user)));
  // }, [rest]);

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

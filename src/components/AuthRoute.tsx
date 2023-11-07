import {FC, ReactNode} from 'react';
import {useAuth} from '../providers/auth';
import {Redirect} from 'wouter';

const AuthRoute: FC<{children: ReactNode}> = ({children}) => {
  const {isLoggedIn, isLoading, user} = useAuth();

  console.log(isLoggedIn, user);

  return isLoggedIn ? (
    isLoading ? (
      <p>AuthRoute Loading...</p>
    ) : (
      children
    )
  ) : (
    <Redirect to="/" />
  );
};

export default AuthRoute;

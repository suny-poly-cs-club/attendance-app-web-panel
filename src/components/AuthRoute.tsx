import {FC, ReactNode} from 'react';
import {Redirect} from 'wouter';

import {useAuth} from '../providers/auth';
import LoadingPage from '../pages/Loading';

const AuthRoute: FC<{
  children: ReactNode;
  requireAdmin?: boolean;
  requireClubs?: boolean;
}> = ({children, requireAdmin = false}) => {
  const {isLoggedIn, isLoading, user} = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isLoggedIn && user) {
    if (requireAdmin && !user.isAdmin) {
      return <Redirect to="/" />;
    }

    return children;
  }

  return <Redirect to="/" />;
};

export default AuthRoute;

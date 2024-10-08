import type {FC, ReactNode} from 'react';
import {Redirect} from 'wouter';

import {useAuth} from '../providers/auth';
import LoadingPage from '../pages/Loading';

// TODO: show login modal if logged out?

const AuthRoute: FC<{
  children: ReactNode;
  requireAdmin?: boolean;
  requireClubAdmin?: boolean;
}> = ({
  children,
  requireAdmin: requireServiceAdmin = false,
  requireClubAdmin = false,
}) => {
  const {isLoggedIn, isLoading, user} = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isLoggedIn && user) {
    if (
      (requireServiceAdmin && !user.isAdmin) ||
      (requireClubAdmin && !(user.isClubAdmin || user.isAdmin))
    ) {
      return <Redirect to='/' />;
    }

    return children;
  }

  return <Redirect to='/' />;
};

export default AuthRoute;

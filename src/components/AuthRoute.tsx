import {type FC, type ReactNode, lazy} from 'react';
import {Redirect} from 'wouter';

import LoadingPage from '../pages/Loading';
import {useAuth} from '../providers/auth';
const HomePage = lazy(() => import('../pages/Home'));

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

  if (window.location.pathname.includes('/check-in')) {
    //if on the check in page and not logged in, show to login prompt instead of redireting. this way after login it automaticly goes back to the checking indead of deleting the stored code
    return <HomePage />;
  }

  return <Redirect to='/' />;
};

export default AuthRoute;

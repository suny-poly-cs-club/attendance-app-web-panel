import {type FC, Suspense, lazy} from 'react';
import {Route} from 'wouter';

import {Layout} from 'antd';
const {Content, Footer} = Layout;

import Nav from './components/Nav';
import AuthRoute from './components/AuthRoute';

const ProfilePage = lazy(() => import('./pages/Profile'));
const HomePage = lazy(() => import('./pages/Home'));
const ClubDaysPage = lazy(() => import('./pages/ClubDays'));
const ClubsPage = lazy(() => import('./pages/Clubs.tsx'));
const UsersPage = lazy(() => import('./pages/Users.tsx'));

const App: FC = () => {
  return (
    <Layout style={{minHeight: '100vh'}}>
      <Nav />

      <Content style={{padding: '0 50px'}}>
        <Route path='/'>
          <Suspense>
            <HomePage />
          </Suspense>
        </Route>

        <Route path='/club-days'>
          <AuthRoute requireAdmin={true}>
            <Suspense>
              <ClubDaysPage />
            </Suspense>
          </AuthRoute>
        </Route>

        <Route path='/profile'>
          <AuthRoute requireAdmin={true}>
            <Suspense>
              <ProfilePage />
            </Suspense>
          </AuthRoute>
        </Route>

        <Route path='/clubs'>
          <AuthRoute requireAdmin={true}>
            <Suspense>
              <ClubsPage />
            </Suspense>
          </AuthRoute>
        </Route>

        <Route path='/users'>
          <AuthRoute requireAdmin={true}>
            <Suspense>
              <UsersPage />
            </Suspense>
          </AuthRoute>
        </Route>
      </Content>

      <Footer style={{textAlign: 'center', marginTop: 'auto'}}>
        &copy; 2024 SUNY Poly Computer Science Club
      </Footer>
    </Layout>
  );
};

export default App;

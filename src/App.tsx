import {FC} from 'react'
import {useAuth} from './providers/auth';

import {Layout, Menu} from 'antd';
const {Header, Content, Footer} = Layout;

import {Route} from 'wouter';

import {LoginForm, SignUpForm} from './components/Auth';
import HomePage from './pages/Home';
import AuthRoute from './components/AuthRoute';
import ProfilePage from './pages/Profile';

const App: FC = () => {
  const {isLoggedIn, logout} = useAuth();

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Header style={{display: 'flex', alignItems: 'center'}}>
        <Menu
          style={{width: '100%'}}
          theme='dark'
          mode='horizontal'
          items={isLoggedIn
            ? Array.from({length: 8}, (_, i) => ({
              key: i+1,
              label: `nav ${i+1}`,
              onClick: () => alert('click!'),
            }))
            : [{key: 'home', label: 'owo', onClick: () => alert('click!')}]
          }
        />
      </Header>

      <Content style={{padding: '0 50px'}}>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginForm} />
        <Route path="/signup" component={SignUpForm} />

        <Route path="/profile">
          <AuthRoute>
            <ProfilePage />
          </AuthRoute>
        </Route>
      </Content>

      <Footer style={{textAlign: 'center', marginTop: 'auto'}}>
        &copy; 2023 SUNY Poly Computer Science Club
      </Footer>
    </Layout>
  )

  // return (
  //   <>
  //     {isLoggedIn && (
  //       <>
  //         <button onClick={() => logout()}>Log Out</button>
  //         <Link href="/profile"><a>Profile</a></Link>
  //       </>
  //     )}

  //     <Route path="/" component={HomePage} />
  //     <Route path="/login" component={LoginForm} />
  //     <Route path="/signup" component={SignUpForm} />

  //     <Route path="/profile">
  //       <AuthRoute>
  //         <ProfilePage />
  //       </AuthRoute>
  //     </Route>
  //   </>
  // )
};

export default App;

import {type FC, useEffect} from 'react';
import {Button} from 'antd';

import {useAuth} from '../providers/auth';
import styles from './Home.module.css';
import {useModal} from '../hooks/modal';
import {LoginForm} from '../components/LogInForm';
import {SignUpForm} from '../components/SignUpForm';

const HomePage: FC = () => {
  const {isLoggedIn, user} = useAuth();

  const {
    isOpen: isLogInFormOpen,
    open: openLogInForm,
    close: closeLogInForm,
  } = useModal(false);
  const {
    isOpen: isSignUpFormOpen,
    open: openSignUpForm,
    close: closeSignUpForm,
  } = useModal(false);

  useEffect(() => {
    if (isLoggedIn) {
      closeLogInForm();
      closeSignUpForm();
    }
  }, [isLoggedIn, closeLogInForm, closeSignUpForm]);

  return (
    <div className={styles.centered}>
      <h1>Attendance Web Pannel</h1>

      {isLoggedIn ? (
        <h2>
          Hello, {user?.firstName} {user?.lastName}
        </h2>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Button onClick={() => openLogInForm()}>Log In</Button>
            <Button onClick={() => openSignUpForm()}>Sign Up</Button>
          </div>

          <LoginForm open={isLogInFormOpen} onCancel={() => closeLogInForm()} />
          <SignUpForm
            open={isSignUpFormOpen}
            onCancel={() => closeSignUpForm()}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;

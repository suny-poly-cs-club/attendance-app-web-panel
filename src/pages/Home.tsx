import {FC, useEffect} from 'react';

import {useAuth} from '../providers/auth';
import {LoginForm, SignUpForm} from '../components/Auth';

import styles from './Home.module.css';
import Modal from '../components/Modal';
import {useModal} from '../hooks/modal';
import {Button} from 'antd';

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
  }, [isLoggedIn]);

  return (
    <div className={styles.centered}>
      <h1>SUNY Poly CS Club Attendance</h1>

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

          <Modal
            isOpen={isLogInFormOpen}
            onClose={closeLogInForm}
            title="Log In"
          >
            <LoginForm />
          </Modal>

          <Modal
            isOpen={isSignUpFormOpen}
            onClose={closeSignUpForm}
            title="Sign Up"
          >
            <SignUpForm />
          </Modal>
        </>
      )}
    </div>
  );
};

export default HomePage;

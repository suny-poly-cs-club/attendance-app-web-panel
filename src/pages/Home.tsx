import Button from 'antd/es/button';
import {type FC, useEffect, useState} from 'react';
import LoginForm from '../components/LogInForm';
import SignUpForm from '../components/SignUpForm';
import {useModal} from '../hooks/modal';
import {useAuth, useRest} from '../providers/auth';
import styles from './Home.module.css';

const HomePage: FC = () => {
  const {isLoggedIn, user} = useAuth();
  const rest = useRest()

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

  const [messageOfTheDay, _updateMessageOfTheDay] = useState("")

  useEffect(() => {
    rest.getMessageOfTheDay().then(text => {
      if(text) {
        _updateMessageOfTheDay(text);
      }
    })
  }, []);

  return (
    <div className={styles.centered}>
      <h1>Attendance Web Panel</h1>

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
      <h3>
        {messageOfTheDay}
      </h3>
    </div>
  );
};

export default HomePage;

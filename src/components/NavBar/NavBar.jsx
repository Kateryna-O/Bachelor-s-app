import { Logo } from '../Logo/Logo';
import css from './NavBar.module.css';
import { LogInModuleWindow } from '../../components/LogInModuleWindow/LogInModuleWindow';

import { useState } from 'react';
import { Modal } from '../../components/Modal/Modal';
import { SignInForm } from '../../components/SignInForm/SignInForm';

export const NavBar = () => {
  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <>
      <div className={css.wrapper}>
        <Logo />
        <div className={css.BtnWrapper}>
          <button
            type="button"
            className={css.btnRed}
            onClick={() => setIsLogInOpen(true)}
          >
            Log in
          </button>
          <button
            type="button"
            className={css.btnRed}
            onClick={() => setIsSignUpOpen(true)}
          >
            Sing up
          </button>
        </div>
      </div>
      <hr className={css.line} />

      {isLogInOpen && (
        <Modal onClose={() => setIsLogInOpen(false)}>
          <LogInModuleWindow onClose={() => setIsLogInOpen(false)} />
        </Modal>
      )}

      {isSignUpOpen && (
        <Modal onClose={() => setIsSignUpOpen(false)}>
          <SignInForm onClose={() => setIsSignUpOpen(false)} />
        </Modal>
      )}
    </>
  );
};

import { useState } from 'react';
import { NavBar } from '../NavBar/NavBar';
import css from './Hero.module.css';
import { Modal } from '../../components/Modal/Modal';
import { SignInForm } from '../../components/SignInForm/SignInForm';

export const Hero = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  return (
    <div className={css.WrapperImg}>
      <NavBar />
      <div className={css.container}>
        <h1 className={css.textH1}>Make communication safe</h1>
        <p className={css.text}>
          Communicate confidentially and securely. Protect your data now!
        </p>
        <button
          type="button"
          className={css.btn}
          onClick={() => setIsSignInOpen(true)}
        >
          Start
        </button>
      </div>
      {isSignInOpen && (
        <Modal onClose={() => setIsSignInOpen(false)}>
          <SignInForm onClose={() => setIsSignInOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

// SignUpPage.jsx
import { Modal } from '../../components/Modal/Modal';
import { SignInForm } from '../../components/SignInForm/SignInForm';
import { useNavigate } from 'react-router-dom';

export const SignUpPage = () => {
  const navigate = useNavigate();

  const closeModal = () => {
    navigate('/'); // при закритті модалки повертаємось на головну
  };

  return (
    <Modal onClose={closeModal}>
      <SignInForm onClose={closeModal} />
    </Modal>
  );
};

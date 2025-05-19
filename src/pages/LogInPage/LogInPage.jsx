// SignInPage.jsx
import { Modal } from '../../components/Modal/Modal';
import { LogInModuleWindow } from '../../components/LogInModuleWindow/LogInModuleWindow';
import { useNavigate } from 'react-router-dom';

export const LogInPage = () => {
  const navigate = useNavigate();

  const closeModal = () => {
    navigate('/'); // при закритті модалки повертаємось на головну
  };

  return (
    <Modal onClose={closeModal}>
      <LogInModuleWindow onClose={closeModal} />
    </Modal>
  );
};

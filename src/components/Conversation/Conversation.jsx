import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserById } from '../../redux/users/operations';
import defaultAvatar from '../../assets/img/tess_1x.png';
import css from './Conversation.module.css';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';

export const Conversation = ({
  data,
  currentUser,
  onEnterChat,
  sendMessage,
  receiveMessage,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = data.members.find(id => id !== currentUser);

    const getUserData = async () => {
      try {
        const actionResult = await dispatch(fetchUserById(userId));
        const user = actionResult.payload;
        setUserData(user.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (data) {
      getUserData();
    }
  }, [dispatch, data, currentUser]);

  if (!userData) return <Loader />;

  const handleChatEnter = () => {
    onEnterChat();
    navigate('/chat', {
      state: {
        currentUser,
        chat: data,
        sendMessage,
        receiveMessage,
      },
    });
  };

  return (
    <div className={css.userList}>
      <div className={css.userCard}>
        <img
          src={userData.photo || defaultAvatar}
          alt={userData.name}
          className={css.avatar}
        />
        <div>
          <p className={css.name}>{userData.name}</p>
          <button className={css.chatButton} onClick={handleChatEnter}>
            Enter the chat
          </button>
        </div>
      </div>
    </div>
  );
};

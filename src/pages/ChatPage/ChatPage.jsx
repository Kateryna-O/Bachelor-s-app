import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchUserById } from '../../redux/users/operations';
import defaultAvatar from '../../assets/img/tess_1x.png';
import css from './ChatPage.module.css';
import Loader from '../../components/Loader/Loader';
import sprite from '../../assets/icons/sprite.svg';
import { addMessage, getMessages } from '../../api/MessagesRequest.js';
import InputEmoji from 'react-input-emoji';
import { useSocket } from '../../helpers/useSocket';

export const ChatPage = () => {
  const location = useLocation();
  const { currentUser, chat } = location.state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sendMessage, receiveMessage } = useSocket(currentUser);

  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessages] = useState('');

  useEffect(() => {
    const userId = chat?.members?.find(id => id !== currentUser);
    const getUserData = async () => {
      try {
        const actionResult = await dispatch(fetchUserById(userId));
        const user = actionResult.payload;
        setUserData(user.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [dispatch, chat, currentUser]);

  useEffect(() => {
    const fetchingMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
        console.log('Fetched initial messages:', data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchingMessages();
  }, [chat]);

  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chat._id) {
      console.log('New message received via socket:', receiveMessage);
      setMessages(prevMessages => [...prevMessages, receiveMessage]);
    }
  }, [receiveMessage, chat._id]);

  const handleChange = newMessage => {
    setNewMessages(newMessage);
  };

  if (!userData) return <Loader />;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handelSend = async e => {
    e.preventDefault();

    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    try {
      const { data } = await addMessage(message);
      setMessages(prev => [...prev, data]);
      setNewMessages('');
      console.log('Message sent and saved:', data);

      const receiverId = chat.members.find(id => id !== currentUser);
      sendMessage({ ...data, receiverId }); // Відправка через сокет
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={css.chatWrapper}>
      <>
        <div className={css.wrapperHeader}>
          <button className={css.btnBack} onClick={handleGoBack}>
            <svg className={css.icon}>
              <use href={`${sprite}#icon-circle-left`} />
            </svg>
          </button>
          <div className={css.userCard}>
            <img
              src={userData.photo || defaultAvatar}
              alt={userData.name}
              className={css.avatar}
            />
            <p className={css.name}>{userData.name}</p>
          </div>
        </div>

        <div className={css.chatBody}>
          {messages.map(message => (
            <div
              key={message._id}
              className={`${css.message} ${
                message.senderId === currentUser ? css.own : ''
              }`}
            >
              <span>{message.text}</span>
              <span className={css.timestamp}>
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>

        <div className={css.chatInputWrapper}>
          <InputEmoji value={newMessage} onChange={handleChange} />
          <button className={css.sendButton} onClick={handelSend}>
            Send
          </button>
        </div>
      </>
    </div>
  );
};

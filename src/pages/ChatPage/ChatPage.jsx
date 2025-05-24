import { useEffect, useRef, useState } from 'react';
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
import {
  decryptMessageForUser,
  encryptMessageForUser,
  getStoredPrivateKey,
} from '../../helpers/encryption';
import { API } from '../../helpers/axios';

export const ChatPage = () => {
  const location = useLocation();
  const { currentUser, chat } = location.state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sendMessage, receiveMessage } = useSocket(currentUser);
  const scroll = useRef();
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessages] = useState('');

  async function getRecipientPublicKey(userId) {
    const { data } = await API.get(`/users/${userId}/public-key`);
    return data.publicKey;
  }

  const fetchRecipientPublicKey = async () => {
    const userId = chat?.members?.find(id => id !== currentUser);
    return await getRecipientPublicKey(userId);
  };

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
        const privateKey = await getStoredPrivateKey();

        const decryptedMessages = await Promise.all(
          data.map(async msg => {
            try {
              if (!msg.encryptedMessage || !msg.encryptedAESKey || !msg.iv) {
                console.warn(
                  'Пропущено повідомлення через відсутні поля:',
                  msg
                );
                return { ...msg, text: '[Invalid message data]' };
              }

              const text = await decryptMessageForUser(
                msg.encryptedMessage,
                msg.encryptedAESKey,
                msg.iv,
                privateKey
              );
              return { ...msg, text };
            } catch (err) {
              console.error(
                'Помилка при розшифруванні повідомлення:',
                err,
                msg
              );
              return { ...msg, text: '[Unable to decrypt]' };
            }
          })
        );

        setMessages(decryptedMessages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchingMessages();
  }, [chat]);

  useEffect(() => {
    const decryptIncoming = async () => {
      if (receiveMessage && receiveMessage.chatId === chat._id) {
        try {
          const privateKey = await getStoredPrivateKey();

          if (
            receiveMessage.encryptedMessage &&
            receiveMessage.encryptedAESKey &&
            receiveMessage.iv
          ) {
            const text = await decryptMessageForUser(
              receiveMessage.encryptedMessage,
              receiveMessage.encryptedAESKey,
              receiveMessage.iv,
              privateKey
            );
            setMessages(prev => [...prev, { ...receiveMessage, text }]);
          } else {
            console.warn(
              'Пропущено вхідне повідомлення через відсутні поля:',
              receiveMessage
            );
          }
        } catch (err) {
          console.error('Failed to decrypt incoming message', err);
        }
      }
    };

    decryptIncoming();
  }, [receiveMessage, chat._id]);

  const handleChange = newMessage => setNewMessages(newMessage);
  const handleGoBack = () => navigate(-1);

  // const handelSend = async e => {
  //   e.preventDefault();
  //   const receiverId = chat.members.find(id => id !== currentUser);
  //   const publicKey = await fetchRecipientPublicKey();

  //   const { encryptedMessage, encryptedAESKey, iv } =
  //     await encryptMessageForUser(newMessage, publicKey);

  //   const message = {
  //     senderId: currentUser,
  //     chatId: chat._id,
  //     encryptedMessage,
  //     encryptedAESKey,
  //     iv,
  //   };

  //   try {
  //     const { data } = await addMessage(message);
  //     setMessages(prev => [...prev, { ...data, text: newMessage }]);
  //     setNewMessages('');
  //     sendMessage({ ...data, receiverId });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handelSend = async e => {
    e.preventDefault();
    const receiverId = chat.members.find(id => id !== currentUser);
    const publicKey = await fetchRecipientPublicKey();

    const { encryptedMessage, encryptedAESKey, iv } =
      await encryptMessageForUser(newMessage, publicKey);

    const message = {
      senderId: currentUser,
      chatId: chat._id,
      encryptedMessage,
      encryptedAESKey,
      iv,
    };

    try {
      const { data } = await addMessage(message);
      setMessages(prev => [...prev, { ...data, text: newMessage }]);
      setNewMessages('');

      // ⬇️ Виправлено тут: відправляється повний об'єкт
      sendMessage({
        _id: data._id,
        chatId: chat._id,
        senderId: currentUser,
        receiverId,
        encryptedMessage,
        encryptedAESKey,
        iv,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!userData) return <Loader />;

  return (
    <div className={css.chatWrapper}>
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
            ref={scroll}
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
    </div>
  );
};

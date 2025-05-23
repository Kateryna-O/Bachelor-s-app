import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { PopUpMenu } from '../../components/PopUpMenu/PopUpMenu';
import { userChats } from '../../api/ChatRequsts.js';
import { Conversation } from '../../components/Conversation/Conversation.jsx';
import { useSocket } from '../../helpers/useSocket';
import css from './MainPage.module.css';

export const MainPage = () => {
  const user = useSelector(state => state.auth.user);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const { sendMessage, receiveMessage, onlineUsers } = useSocket(user.id);

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user.id);
        setChats(data);
      } catch (error) {
        console.error(error);
      }
    };

    getChats();
  }, [user]);

  return (
    <div className={css.pageWrapper}>
      <PopUpMenu />
      <div className={css.wrapperSearch}>
        <input
          type="text"
          placeholder="Search by email..."
          className={css.searchInput}
        />
        <button className={css.button}>
          <svg className={css.btnIcon}>
            <use href={`#icon-search`} />
          </svg>
        </button>
      </div>

      {chats.map(chat => (
        <div key={chat._id}>
          <Conversation
            data={chat}
            currentUser={user.id}
            chat={currentChat}
            onEnterChat={() => setCurrentChat(chat)}
            // НЕ передаємо sendMessages і receiveMessage сюди
          />
        </div>
      ))}
    </div>
  );
};

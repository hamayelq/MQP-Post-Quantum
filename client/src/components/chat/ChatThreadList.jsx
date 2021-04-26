import { useState } from "react";
import { useHistory, useNavigate, useParams } from "react-router-dom";
import { List } from "@material-ui/core";
import ChatThreadItem from "./ChatThreadItem";

const ChatThreadList = ({ chats }) => {
  const { threadKey } = useParams();
  const [activeThreadId, setActiveThreadId] = useState(`${threadKey}`);
  const history = useHistory();

  const handleSelect = (chatId) => {
    setActiveThreadId(chatId);

    history.push(`/chat/${chatId}`);
  };

  return (
    <List>
      {chats &&
        chats.getChats
          // .sort(
          //   (a, b) =>
          //     new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          // )
          .map((chat) => (
            <ChatThreadItem
              active={activeThreadId === chat.uuid}
              key={chat.uuid}
              chat={chat}
              onSelect={() => handleSelect(chat.uuid)}
            />
          ))}
    </List>
  );
};

export default ChatThreadList;

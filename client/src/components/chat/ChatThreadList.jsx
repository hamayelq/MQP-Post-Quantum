import { useState } from "react";
import { useHistory, useNavigate } from "react-router-dom";
import { List } from "@material-ui/core";
import ChatThreadItem from "./ChatThreadItem";

const ChatThreadList = ({ chats }) => {
  const [activeThreadId, setActiveThreadId] = useState("");
  const history = useHistory();

  const handleSelect = (chatId) => {
    setActiveThreadId(chatId);

    history.push(`/chat/${chatId}`);
  };

  return (
    <List>
      {chats &&
        chats.getChats.map((chat) => (
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

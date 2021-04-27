import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { List } from "@material-ui/core";
import ChatThreadItem from "./ChatThreadItem";

const ChatThreadList = ({ chats }) => {
  const { threadKey } = useParams();
  const [activeThreadId, setActiveThreadId] = useState(`${threadKey}`);
  let chatsCopy;

  const history = useHistory();

  if (chats && chats.getChats) {
    chatsCopy = [...chats.getChats];
  }

  const handleSelect = (chatId) => {
    setActiveThreadId(chatId);

    history.push(`/chat/${chatId}`);
  };

  return (
    <List>
      {chats &&
        chatsCopy
          .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
          .reverse()
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

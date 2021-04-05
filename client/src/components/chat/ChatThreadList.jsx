import { List } from "@material-ui/core";
import ChatThreadItem from "./ChatThreadItem";

const ChatThreadList = (props) => {
  const handleSelect = (threadId) => {};

  return (
    <List {...props}>
      {/* {threads.allIds.map((threadId) => (
        <ChatThreadItem
          active={activeThreadId === threadId}
          key={threadId}
          onSelect={() => handleSelect(threadId)}
          thread={threads.byId[threadId]}
        />
      ))} */}
    </List>
  );
};

export default ChatThreadList;

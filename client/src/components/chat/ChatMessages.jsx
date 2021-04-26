import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
// import useAuth from "../../../hooks/useAuth";
import Scrollbar from "../Scrollbar";
import ChatMessage from "./ChatMessage";

const ChatMessages = (props) => {
  const { messages } = props;
  const rootRef = useRef(null);
  // const { user } = useAuth();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollToBottom = () => {
    // eslint-disable-next-line no-underscore-dangle
    if (rootRef?.current?._container) {
      // eslint-disable-next-line no-underscore-dangle
      rootRef.current._container.scrollTop =
        rootRef.current._container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <Scrollbar options={{ suppressScrollX: true }} ref={rootRef}>
      <Box
        sx={{
          p: 2,
        }}
      >
        {messages &&
          messages.map((message) => {
            return (
              <ChatMessage
                key={message.uuid}
                sender={message.sender}
                content={message.content}
                me={message.me}
                createdAt={messages.date}
              />
            );
          })}
      </Box>
    </Scrollbar>
  );
};

ChatMessages.propTypes = {
  // @ts-ignore
  messages: PropTypes.array,
};

export default ChatMessages;

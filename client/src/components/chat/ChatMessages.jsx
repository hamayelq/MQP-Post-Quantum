import { useState, useEffect, useRef } from "react";
import { decryptMessage } from "../../utils/decryptMessage";

import PropTypes from "prop-types";
import { Box, useMediaQuery, useTheme } from "@material-ui/core";
// import useAuth from "../../../hooks/useAuth";
import Scrollbar from "../Scrollbar";
import ChatMessage from "./ChatMessage";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

const ChatMessages = (props) => {
  const { messages, chatId, symKey } = props;
  const userUuid = sessionStorage.getItem("userUuid");

  // const { data: encryptedSymKey } = useGetChatSymKeyQuery({
  //   variables: { chatId: chatId, userId: userUuid },
  //   fetchPolicy: "network-only",
  // });

  // console.log(encryptedSymKey);

  const rootRef = useRef(null);
  const { width: windowWidth } = useWindowDimensions();
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));
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

  useEffect(() => {}, [windowWidth]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <Scrollbar options={{ suppressScrollX: true }} ref={rootRef}>
      <Box
        sx={{
          p: 2,
          width: isMobile ? windowWidth : windowWidth - 262,
        }}
      >
        {messages &&
          messages.map((message) => {
            const decryptedMessage = decryptMessage(symKey, message.content);
            return (
              <ChatMessage
                key={message.uuid}
                sender={message.sender}
                content={decryptedMessage}
                me={message.me}
                createdAt={message.date}
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

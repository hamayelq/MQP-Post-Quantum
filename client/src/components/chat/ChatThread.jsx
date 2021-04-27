import { Box, Divider } from "@material-ui/core";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  useCreateMessageMutation,
  useGetMessagesQuery,
} from "../../generated/graphql";
import { Typography } from "@material-ui/core";
import ChatMessageAdd from "./ChatMessageAdd";
import ChatMessages from "./ChatMessages";
import ChatThreadComposer from "./ChatThreadComposer";
import Scrollbar from "../Scrollbar";

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const ChatThread = () => {
  const { threadKey } = useParams();
  const rootRef = useRef(null);
  const userUuid = sessionStorage.getItem("userUuid") || "";
  const [createMessage] = useCreateMessageMutation();
  const {
    data: messages,
    refetch: refetchMessages,
    loading: messagesLoading,
    error: messagesError,
  } = useGetMessagesQuery({
    variables: {
      chatId: threadKey || "",
      userId: userUuid,
    },
  });

  const mode = threadKey ? "DETAIL" : "COMPOSE";

  const handleSendMessage = async (content) => {
    let response;
    try {
      response = await createMessage({
        variables: {
          chatId: threadKey,
          content: content,
          userId: userUuid,
        },
      });
    } catch (err) {
      console.error(err);
    }

    if (response && response.data) {
      console.log("Send message succesful", response.data);
      refetchMessages();
    }
  };

  useInterval(() => {
    !messagesError && refetchMessages();
  }, 100);

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        height: "100vh",
      }}
    >
      {mode === "COMPOSE" && <ChatThreadComposer />}
      {mode === "DETAIL" && (
        <>
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
            }}
          >
            {!messagesLoading &&
              !messagesError &&
              messages.getMessages.messages.length === 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto",
                  }}
                >
                  <Typography
                    color="textSecondary"
                    variant="body1"
                    align="center"
                    style={{ marginTop: "45vh" }}
                  >
                    Send a message to your new friend!
                  </Typography>
                </div>
              )}
            {!messagesLoading && !messagesError && (
              <ChatMessages
                messages={[...messages.getMessages.messages].reverse()}
              />
            )}
          </Box>
          <Divider />
          <ChatMessageAdd disabled={false} onSend={handleSendMessage} />
        </>
      )}
    </Box>
  );
};

export default ChatThread;

import {
  Box,
  Divider,
  useMediaQuery,
  useTheme,
  Typography,
} from "@material-ui/core";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import {
  useCreateMessageMutation,
  useGetMessagesQuery,
} from "../../generated/graphql";
import ChatMessageAdd from "./ChatMessageAdd";
import ChatMessages from "./ChatMessages";
import ChatThreadComposer from "./ChatThreadComposer";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { useInterval } from "../../hooks/useInterval";
import { sample } from "lodash";
import Scrollbar from "../Scrollbar";

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

  const { width: windowWidth } = useWindowDimensions();
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));

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

  const emoji = sample(["😄", "😎", "😊", "😳", "😅", "👽", "👀", "👻"]);

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
                    Send a message to your new friend {emoji}
                  </Typography>
                </div>
              )}

            {!messagesLoading &&
              !messagesError &&
              messages.getMessages.messages.length > 0 && (
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

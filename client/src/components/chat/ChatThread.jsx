import { Box, Divider, useTheme, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import {
  useCreateMessageMutation,
  useGetMessagesQuery,
} from "../../generated/graphql";
import ChatMessageAdd from "./ChatMessageAdd";
import ChatMessages from "./ChatMessages";
import ChatThreadComposer from "./ChatThreadComposer";
import { useInterval } from "../../hooks/useInterval";
import { sample } from "lodash";
import { encryptMessage } from "../../utils/encryptMessage";

const ChatThread = ({ symKey }) => {
  const { threadKey } = useParams();
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
    const encryptedMessage = encryptMessage(symKey, content);

    let response;
    try {
      response = await createMessage({
        variables: {
          chatId: threadKey,
          content: encryptedMessage,
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
                  chatId={threadKey}
                  symKey={symKey}
                />
              )}
          </Box>
          <Divider />
          {symKey.length > 0 && (
            <ChatMessageAdd disabled={false} onSend={handleSendMessage} />
          )}
        </>
      )}
    </Box>
  );
};

export default ChatThread;

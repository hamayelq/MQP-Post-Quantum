import { Box, Divider } from "@material-ui/core";
import { useParams } from "react-router-dom";
import {
  useCreateMessageMutation,
  useGetMessagesQuery,
} from "../../generated/graphql";
import ChatMessageAdd from "./ChatMessageAdd";
import ChatMessages from "./ChatMessages";
import ChatThreadComposer from "./ChatThreadComposer";

const ChatThread = () => {
  const { threadKey } = useParams();
  const userUuid = sessionStorage.getItem("userUuid") || "";
  const [createMessage] = useCreateMessageMutation();
  const { data: messages, refetch: refetchMessages } = useGetMessagesQuery({
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
    }
  };

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
            {messages && (
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

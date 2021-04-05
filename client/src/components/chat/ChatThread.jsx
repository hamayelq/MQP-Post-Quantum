import { Box, Divider } from "@material-ui/core";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatMessageAdd from "./ChatMessageAdd";
import ChatMessages from "./ChatMessages";
import ChatThreadComposer from "./ChatThreadComposer";
import ChatThreadToolbar from "./ChatThreadToolbar";

const threadSelector = (state) => {
  const { threads, activeThreadId } = state.chat;
  const thread = threads.byId[activeThreadId];

  if (thread) {
    return thread;
  }

  return {
    id: null,
    messages: [],
    participants: [],
    unreadMessages: 0,
  };
};

const ChatThread = () => {
  const { threadKey } = useParams();

  const mode = threadKey ? "DETAIL" : "COMPOSE";

  const handleAddRecipient = (recipient) => {};

  const handleRemoveRecipient = (recipientId) => {};

  const handleSendMessage = async () => {
    try {
      // Handle send message
    } catch (err) {
      console.error(err);
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
      {mode === "DETAIL" && <ChatThreadToolbar participants={[]} />}
      {mode === "COMPOSE" && (
        <ChatThreadComposer
          onAddRecipient={handleAddRecipient}
          onRemoveRecipient={handleRemoveRecipient}
          recipients={[]}
        />
      )}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <ChatMessages messages={[]} participants={[]} />
      </Box>
      <Divider />
      {/* <ChatMessageAdd disabled={false} onSend={handleSendMessage} /> */}
    </Box>
  );
};

export default ChatThread;

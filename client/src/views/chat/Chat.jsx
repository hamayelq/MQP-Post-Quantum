import { Box } from "@material-ui/core";
import { ChatSidebar, ChatThread } from "../../components/chat";

export const Chat = () => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          height: "100%",
        }}
      >
        <ChatSidebar />
        <ChatThread />
      </Box>
    </>
  );
};

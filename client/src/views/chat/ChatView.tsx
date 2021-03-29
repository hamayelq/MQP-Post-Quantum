import { useEffect } from "react";
import { Box } from "@material-ui/core";
import { ChatSidebar, ChatThread } from "../../components/dashboard/chat";
import { getThreads } from "../../slices/chat";
import { useDispatch } from "../../store";

const Chat = (): React.FC => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getThreads());
  }, []);

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

export default Chat;

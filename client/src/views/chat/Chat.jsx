import { Box } from "@material-ui/core";
import { useState } from "react";
import { ChatSidebar, ChatThread } from "../../components/chat";
import SettingsDrawer from "../../components/SettingsDrawer";

export const Chat = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          height: "100%",
        }}
      >
        <SettingsDrawer
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
          setOpen={setOpen}
        />
        <ChatSidebar handleOpen={handleOpen} />
        <ChatThread />
      </Box>
    </>
  );
};

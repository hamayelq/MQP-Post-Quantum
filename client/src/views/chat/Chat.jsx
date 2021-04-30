import { Box } from "@material-ui/core";
import { useState, useEffect } from "react";
import { ChatSidebar, ChatThread } from "../../components/chat";
import { useHistory, useParams } from "react-router-dom";
import SettingsDrawer from "../../components/SettingsDrawer";
import { useGetChatSymKeyQuery } from "../../generated/graphql";
import { decryptSymKey } from "../../utils/decryptSymKey";

export const Chat = () => {
  const { threadKey } = useParams();
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [symKey, setSymKey] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(`${threadKey}`);

  const userUuid = sessionStorage.getItem("userUuid");

  const {
    data: encryptedSymKey,
    loading,
    error,
    refetch: refetchSymKey,
  } = useGetChatSymKeyQuery({
    variables: { chatId: threadKey, userId: userUuid },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (threadKey && !loading && !error) {
      refetchSymKey();
      const { decryptedSymKeyBytes } = decryptSymKey(
        encryptedSymKey.getChatSymKey.encryptedSymKey
      );
      console.log(decryptedSymKeyBytes);
      setSymKey(decryptedSymKeyBytes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleChatSelect = (chat) => {
    if (!chat.pendingRequest) {
      setActiveThreadId(chat.uuid);

      const symKey =
        chat?.sentByUuid === userUuid
          ? chat.sentBySymKey
          : chat?.acceptedBySymKey;

      const { decryptedSymKeyBytes } = decryptSymKey(symKey);

      setSymKey(decryptedSymKeyBytes);

      history.push(`/chat/${chat.uuid}`);
    }
  };

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
        <ChatSidebar
          handleOpen={handleOpen}
          activeThreadId={activeThreadId}
          handleChatSelect={handleChatSelect}
          symKey={symKey}
        />
        {<ChatThread symKey={symKey} />}
      </Box>
    </>
  );
};

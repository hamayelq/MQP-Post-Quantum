import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Fab,
  Drawer,
  IconButton,
  Typography,
  useTheme,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuIcon from "@material-ui/icons/Menu";
import Scrollbar from "../Scrollbar";
import ChatContactSearch from "./ChatContactSearch";
import ChatThreadList from "./ChatThreadList";
import CogIcon from "../../icons/Cog";
import {
  useCreateChatMutation,
  useGetChatsQuery,
  useGetUsersQuery,
  useLogoutMutation,
} from "../../generated/graphql";
import { deleteStore } from "../../utils/deleteStore";
import { getUsersKeys } from "../../utils/getUsersKeys";
import { generateEncryptedSymKeys } from "../../utils/generateEncryptedSymKeys";

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

const ChatSidebar = ({
  handleOpen,
  activeThreadId,
  handleChatSelect,
  symKey,
}) => {
  const userUuid = sessionStorage.getItem("userUuid") || "";
  const userUsername = sessionStorage.getItem("userUsername") || "";
  const { data: users, error: usersError } = useGetUsersQuery({
    variables: { uuid: userUuid }, // change uuid to userId
    fetchPolicy: "network-only",
  });
  const {
    data: chats,
    refetch: refetchChats,
    error: chatsError,
  } = useGetChatsQuery({
    variables: { userId: userUuid },
    fetchPolicy: "network-only",
  });

  const [logout, { client }] = useLogoutMutation();
  const [createChat] = useCreateChatMutation();

  const theme = useTheme();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mobile = !useMediaQuery(theme.breakpoints.up("sm"));
  const [searchResults, setSearchResults] = useState([]);
  const [openDrawer, setDrawerOpen] = useState(false);

  const handleSearchClickAway = () => {
    setIsSearchFocused(false);
    setSearchQuery("");
  };

  const handleSearchChange = async (event) => {
    const { value } = event.target;
    const results = users.getUsers;

    setSearchQuery(value);

    if (searchQuery) {
      const cleanQuery = searchQuery.toLowerCase().trim();
      const filteredUsers = results.filter((user) =>
        user.username.toLowerCase().includes(cleanQuery)
      );
      setSearchResults(filteredUsers);
    }
  };

  const handleSearchFocus = () => {
    setSearchResults(users.getUsers);
    setIsSearchFocused(true);
  };

  const handleSearchSelect = async (result) => {
    setIsSearchFocused(false);
    setSearchQuery("");

    const { encrArray, friendPublicKey } = getUsersKeys(result.publicKey);

    // console.log(encrArray, friendPublicKey);

    const {
      encryptedSentBySymKey,
      encryptedAcceptedBySymKey,
    } = generateEncryptedSymKeys(encrArray, friendPublicKey);

    let response;
    try {
      response = await createChat({
        variables: {
          memberIds: [result.uuid],
          userId: userUuid,
          sentBySymKey: encryptedSentBySymKey,
          acceptedBySymKey: encryptedAcceptedBySymKey,
        },
      });
    } catch (err) {
      console.log(err);
      console.log(response.data);
    }

    if (response && response.data) {
      console.log("Create chat succesful");
      refetchChats();
    }
  };

  useInterval(() => {
    !chatsError && !usersError && refetchChats();
  }, 100);

  return (
    <>
      {mobile && (
        <Fab
          sx={{
            // backgroundColor: "transparent",
            margin: (theme) => theme.spacing(1),
            outline: "none",
            position: "fixed",
            zIndex: (theme) => theme.zIndex.speedDial,
            boxShadow: "none",
            backgroundColor: (theme) => theme.palette.background.paper,
          }}
          disableTouchRipple
          disableFocusRipple
          size="small"
          onClick={() => setDrawerOpen(!openDrawer)}
        >
          <MenuIcon color="primary" />
        </Fab>
      )}
      <Drawer
        open={openDrawer}
        onClose={() => setDrawerOpen(false)}
        variant={!mobile ? "permanent" : "temporary"}
        style={{
          display: "flex",
          backgroundColor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          flexDirection: "column",
          // maxWidth: 262,
          width: 262,
        }}
      >
        {/* <Box
      // sx={{
      //   display: "flex",
      //   backgroundColor: "background.paper",
      //   borderRight: 1,
      //   borderColor: "divider",
      //   flexDirection: "column",
      //   maxWidth: "100%",
      //   width: drawerWidth,
      // }}
      > */}
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            height: 64,
            px: 2,
          }}
        >
          <Box mr={1} display="inline">
            <Typography color="textPrimary" variant="h5">
              Chats
            </Typography>
          </Box>
          <Typography color="textSecondary" variant="h5">
            {userUsername.substring(0, 10)}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton style={{ outline: "none" }} onClick={handleOpen}>
            <CogIcon fontSize="small" />
          </IconButton>
        </Box>

        <ChatContactSearch
          isFocused={isSearchFocused}
          onChange={handleSearchChange}
          onClickAway={handleSearchClickAway}
          onFocus={handleSearchFocus}
          onSelect={handleSearchSelect}
          query={searchQuery}
          results={searchResults || []}
          style={{ marginBottom: 20 }}
        />

        <Scrollbar options={{ suppressScrollX: true }}>
          <Box
            sx={{
              display: isSearchFocused ? "none" : undefined,
              overflowY: "auto",
            }}
          >
            <ChatThreadList
              chats={chats}
              activeThreadId={activeThreadId}
              handleSelect={handleChatSelect}
              symKey={symKey}
            />
          </Box>
        </Scrollbar>
        <Box sx={{ mb: 1, ml: 1, mr: 1 }}>
          <Button
            variant="contained"
            disableElevation
            fullWidth
            // style={{ borderRadius: 0 }}
            onClick={async () => {
              await logout(); // logout
              await client.resetStore({});
              deleteStore();
            }}
          >
            Logout
          </Button>
        </Box>
        {/* </Box> */}
      </Drawer>
    </>
  );
};

export default ChatSidebar;

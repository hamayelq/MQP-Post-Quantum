import { useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Fab,
  Drawer,
  Hidden,
  IconButton,
  makeStyles,
  Typography,
  useTheme,
  Collapse,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuIcon from "@material-ui/icons/Menu";
import Scrollbar from "../Scrollbar";
import ChatContactSearch from "./ChatContactSearch";
import ChatThreadList from "./ChatThreadList";
import {
  useCreateChatMutation,
  useGetChatsQuery,
  useGetUsersQuery,
  useLoginMutation,
} from "../../generated/graphql";
import { setAccessToken } from "../../accessToken";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

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

const ChatSidebar = () => {
  const userUuid = sessionStorage.getItem("userUuid") || "";
  const userUsername = sessionStorage.getItem("userUsername") || "";
  const { data: users } = useGetUsersQuery({
    variables: { uuid: userUuid }, // change uuid to userId
    fetchPolicy: "network-only",
  });
  const { data: chats, refetch: refetchChats } = useGetChatsQuery({
    variables: { userId: userUuid },
    fetchPolicy: "network-only",
  });
  const [logout, { client }] = useLoginMutation();
  const [createChat] = useCreateChatMutation();

  const theme = useTheme();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const mobile = useMediaQuery(theme.breakpoints.up("sm"));
  const { width } = useWindowDimensions();
  const mobileWidth = width * 0.25;
  const [drawerWidth, setDrawerWidth] = useState(mobileWidth);
  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    setDrawerWidth(mobileWidth);
  }, [mobileWidth]);

  useEffect(() => {
    setToggled(false);
  }, [mobile]);

  const toggleDrawer = () => {
    if (!toggled) {
      setDrawerWidth(300);
      setToggled(true);
    }
    if (toggled) {
      setDrawerWidth(mobileWidth);
      setToggled(false);
    }
  };

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

    let response;
    try {
      response = await createChat({
        variables: {
          memberIds: [result.uuid],
          userId: userUuid,
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
    refetchChats();
  }, 100);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          flexDirection: "column",
          maxWidth: "100%",
          width: drawerWidth,
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            height: 64,
            px: 2,
          }}
        >
          <Hidden smUp>
            <IconButton
              style={{ backgroundColor: "transparent" }}
              disableFocusRipple
              onClick={() => toggleDrawer()}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>

          {(toggled || mobile) && (
            <>
              <Box mr={1} display="inline">
                <Typography color="textPrimary" variant="h5">
                  Chats
                </Typography>
              </Box>
              <Typography color="textSecondary" variant="h5">
                {userUsername}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
            </>
          )}
        </Box>

        <Collapse in={toggled || mobile}>
          <ChatContactSearch
            isFocused={isSearchFocused}
            onChange={handleSearchChange}
            onClickAway={handleSearchClickAway}
            onFocus={handleSearchFocus}
            onSelect={handleSearchSelect}
            query={searchQuery}
            results={searchResults || []}
            style={{ marginBottom: 10 }}
          />
        </Collapse>
        <Scrollbar options={{ suppressScrollX: true }}>
          <Box sx={{ display: isSearchFocused ? "none" : undefined }}>
            <ChatThreadList chats={chats} toggled={toggled} mobile={mobile} />
          </Box>
        </Scrollbar>

        <Button
          variant="contained"
          fullWidth
          style={{ borderRadius: 0 }}
          onClick={async () => {
            // await logout(); // logout
            // setAccessToken(""); // set access token to null as well
            // await client.resetStore();
          }}
        >
          Logout
        </Button>
      </Box>
    </>
  );
};

export default ChatSidebar;

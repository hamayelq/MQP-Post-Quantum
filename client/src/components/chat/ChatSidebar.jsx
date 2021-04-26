import { useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Hidden, IconButton, Typography } from "@material-ui/core";
import CogIcon from "../../icons/Cog";
import PencilAltIcon from "../../icons/PencilAlt";
import Scrollbar from "../Scrollbar";
import ChatContactSearch from "./ChatContactSearch";
import ChatThreadList from "./ChatThreadList";
import {
  useCreateChatMutation,
  useGetChatsQuery,
  useGetUsersQuery,
} from "../../generated/graphql";

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
  const { data: users } = useGetUsersQuery({
    variables: { uuid: userUuid }, // change uuid to userId
    fetchPolicy: "network-only",
  });
  const { data: chats, refetch: refetchChats } = useGetChatsQuery({
    variables: { userId: userUuid },
    fetchPolicy: "network-only",
  });

  const [createChat] = useCreateChatMutation();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
    <Box
      sx={{
        display: "flex",
        backgroundColor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        flexDirection: "column",
        maxWidth: "100%",
        width: 300,
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
        <Hidden smDown>
          <Typography color="textPrimary" variant="h5">
            Chats
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {/* <IconButton>
            <CogIcon fontSize="small" />
          </IconButton> */}
        </Hidden>
        {/* <IconButton component={RouterLink}>
          <PencilAltIcon fontSize="small" />
        </IconButton> */}
      </Box>
      <Hidden smDown>
        <ChatContactSearch
          isFocused={isSearchFocused}
          onChange={handleSearchChange}
          onClickAway={handleSearchClickAway}
          onFocus={handleSearchFocus}
          onSelect={handleSearchSelect}
          query={searchQuery}
          results={searchResults || []}
        />
      </Hidden>
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box sx={{ display: isSearchFocused ? "none" : undefined }}>
          <ChatThreadList chats={chats} />
        </Box>
      </Scrollbar>
    </Box>
  );
};

export default ChatSidebar;

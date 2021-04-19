import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Hidden, IconButton, Typography } from "@material-ui/core";
import CogIcon from "../../icons/Cog";
import PencilAltIcon from "../../icons/PencilAlt";
import Scrollbar from "../Scrollbar";
import ChatContactSearch from "./ChatContactSearch";
import ChatThreadList from "./ChatThreadList";
import { useGetUsersQuery } from "../../generated/graphql";

const ChatSidebar = () => {
  const userUuid = sessionStorage.getItem("userUuid") || "";
  const { data } = useGetUsersQuery({
    variables: { uuid: userUuid },
    fetchPolicy: "network-only",
  }); // network-only not reading from cache, request every time

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchClickAway = () => {
    setIsSearchFocused(false);
    setSearchQuery("");
  };

  const handleSearchChange = async (event) => {
    const { value } = event.target;
    const results = data.getUsers;

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
    setSearchResults(data.getUsers);
    setIsSearchFocused(true);
  };

  const handleSearchSelect = (result) => {
    setIsSearchFocused(false);
    setSearchQuery("");
  };

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
          <ChatThreadList />
        </Box>
      </Scrollbar>
    </Box>
  );
};

export default ChatSidebar;

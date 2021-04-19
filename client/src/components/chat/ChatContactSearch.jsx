import { forwardRef } from "react";
import {
  Avatar,
  Box,
  ClickAwayListener,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import SearchIcon from "../../icons/Search";

const ChatContactSearch = forwardRef((props, ref) => {
  const {
    isFocused,
    onChange,
    onClickAway,
    onFocus,
    onSelect,
    query,
    results,
    ...other
  } = props;

  const handleSelect = (result) => {
    if (onSelect) {
      onSelect(result);
    }
  };

  const displayResults = query && isFocused;

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Box ref={ref} sx={{ px: 1 }} {...other}>
        <Box
          sx={{
            alignItems: "center",
            backgroundColor: "background.default",
            borderRadius: 22,
            display: "flex",
            height: 44,
            px: 2,
          }}
        >
          <SearchIcon color="action" fontSize="small" />
          <Box
            sx={{
              flexGrow: 1,
              ml: 2,
            }}
          >
            <Input
              fullWidth
              disableUnderline
              onChange={onChange}
              onFocus={onFocus}
              placeholder="Search users"
              value={query}
            />
          </Box>
        </Box>
        {displayResults && (
          <Box sx={{ mt: 2 }}>
            <Typography color="textSecondary" variant="subtitle2">
              Contacts
            </Typography>
            <List>
              {results.map((result) => (
                <ListItem
                  button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                >
                  <ListItemText
                    primary={result.username}
                    primaryTypographyProps={{
                      color: "textPrimary",
                      noWrap: true,
                      variant: "subtitle2",
                    }}
                  />
                </ListItem>
              ))}
              {results.length === 0 && (
                <Box
                  sx={{
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography color="textPrimary" gutterBottom variant="h6">
                    Nothing Found
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    We couldn&apos;t find any matches for &quot;
                    {query}
                    &quot;. Try checking for typos or using complete words.
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
});

export default ChatContactSearch;

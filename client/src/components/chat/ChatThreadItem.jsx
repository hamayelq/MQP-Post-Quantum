import PropTypes from "prop-types";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import { useState } from "react";
import Ban from "../../icons/Ban";

const ChatThreadItem = (props) => {
  const { chat, onSelect, active } = props;
  const [show, setShow] = useState({ display: "none" });

  return (
    <ListItem
      button
      onClick={onSelect}
      onMouseEnter={() => setShow({ display: "" })}
      onMouseLeave={() => setShow({ display: "none" })}
      sx={{
        backgroundColor: active && "action.selected",
        boxShadow: (theme) =>
          active && `inset 4px 0px 0px ${theme.palette.primary.main}`,
      }}
    >
      <ListItemAvatar
        sx={{
          display: "flex",
          justifyContent: {
            sm: "flex-start",
            xs: "center",
          },
        }}
      >
        <Avatar>{chat.name.toUpperCase().substring(0, 2)}</Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={chat.name}
        primaryTypographyProps={{
          color: "textPrimary",
          noWrap: true,
          variant: "subtitle2",
        }}
        secondary={chat.lastMessage || <i>No messages...</i>}
        secondaryTypographyProps={{
          color: "textSecondary",
          noWrap: true,
          variant: "body2",
        }}
      />
      <ListItemSecondaryAction>
        <IconButton
          style={show}
          edge="end"
          // disableFocusRipple
          // disableRipple
          disableTouchRipple
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Ban fontSize="small" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

ChatThreadItem.propTypes = {
  active: PropTypes.bool,
  onSelect: PropTypes.func,
};

ChatThreadItem.defaultProps = {
  active: false,
};

export default ChatThreadItem;

import PropTypes from "prop-types";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";

const ChatThreadItem = (props) => {
  const { chat, onSelect, active } = props;

  return (
    <ListItem
      button
      onClick={onSelect}
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

import PropTypes from "prop-types";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
} from "@material-ui/core";
import { useState } from "react";
import {
  useAcceptRequestMutation,
  useDenyRequestMutation,
} from "../../generated/graphql";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import { decryptEncryptSymKey } from "../../utils/decryptEncryptSymKey";

const ChatThreadItem = (props) => {
  const { chat, onSelect, active } = props;
  const [acceptRequest] = useAcceptRequestMutation();
  const [denyRequest] = useDenyRequestMutation();
  // const [show, setShow] = useState({ display: "none" });

  const userUuid = sessionStorage.getItem("userUuid");

  const handleAcceptRequest = async () => {
    const encryptedSymKey = decryptEncryptSymKey(chat.acceptedBySymKey);

    let response;
    try {
      response = await acceptRequest({
        variables: {
          chatId: chat.uuid,
          encryptedSymKey: encryptedSymKey,
        },
      });
    } catch (err) {
      console.log(err);
      console.log(response.data);
    }

    if (response && response.data) {
      console.log("Chat accepted succesfully");
    }
  };

  const handleDenyRequest = async () => {
    let response;
    try {
      response = await denyRequest({
        variables: {
          chatId: chat.uuid,
        },
      });
    } catch (err) {
      console.log(err);
      console.log(response.data);
    }

    if (response && response.data) {
      console.log("Chat accepted succesfully");
    }
  };

  const RequestButton = () => {
    if (chat.sentByUuid !== userUuid) {
      return (
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            disableTouchRipple
            onClick={() => {
              handleAcceptRequest();
              console.log(chat);
            }}
          >
            <CheckIcon color="action" fontSize="small" />
          </IconButton>
          <IconButton
            edge="end"
            disableTouchRipple
            onClick={() => handleDenyRequest()}
          >
            <CloseIcon color="error" fontSize="small" />
          </IconButton>
        </ListItemSecondaryAction>
      );
    } else return <></>;
  };

  const RequestPending = () => {
    if (chat.sentByUuid === userUuid) {
      return (
        <Tooltip title="Request pending">
          <ListItemSecondaryAction>
            <PauseCircleFilledIcon fontSize="small" color="disabled" />
          </ListItemSecondaryAction>
        </Tooltip>
      );
    } else return <></>;
  };

  return (
    <ListItem
      button
      onClick={onSelect}
      // onMouseEnter={() => setShow({ display: "" })}
      // onMouseLeave={() => setShow({ display: "none" })}
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
      {chat.pendingRequest && (
        <>
          <RequestButton />
          <RequestPending />
        </>
      )}
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

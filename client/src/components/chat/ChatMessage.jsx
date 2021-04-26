import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { formatDistanceToNowStrict } from "date-fns";
import { Lightbox } from "react-modal-image";
import { Avatar, Box, Link, Typography } from "@material-ui/core";

const ChatMessage = (props) => {
  const { content, sender, me, date } = props;
  const [expandMedia, setExpandMedia] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: me ? "row-reverse" : "row",
          maxWidth: 500,
          ml: me ? "auto" : 0,
        }}
      >
        <Avatar
          sx={{
            height: 32,
            ml: me ? 2 : 0,
            mr: me ? 0 : 2,
            width: 32,
          }}
        >
          {sender.username.toUpperCase()[0]}
        </Avatar>
        <div>
          <Box
            sx={{
              backgroundColor: me ? "primary.main" : "background.paper",
              borderRadius: 1,
              boxShadow: 1,
              color: me ? "primary.contrastText" : "text.primary",
              px: 2,
              py: 1,
            }}
          >
            <Typography variant="subtitle2">{sender.username}</Typography>
            <Box sx={{ mt: 1 }}>
              <Typography color="inherit" variant="body1">
                {content}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: me ? "flex-end" : "flex-start",
              mt: 1,
              px: 2,
            }}
          >
            <Typography color="textSecondary" noWrap variant="caption">
              {/* {formatDistanceToNowStrict(date)} ago */}
              {date}
            </Typography>
          </Box>
        </div>
      </Box>
      {expandMedia && (
        <Lightbox large={content} onClose={() => setExpandMedia(true)} />
      )}
    </Box>
  );
};

ChatMessage.propTypes = {};

export default ChatMessage;

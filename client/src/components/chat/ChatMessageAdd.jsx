import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Divider,
  Hidden,
  IconButton,
  TextField,
  Tooltip,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

const ChatMessageAdd = (props) => {
  const { disabled, onSend } = props;
  const [content, setContent] = useState("");

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSend = () => {
    if (!content) {
      return;
    }

    if (onSend) {
      onSend(content);
    }

    setContent("");
  };

  const handleKeyUp = (event) => {
    if (event.keyCode === 13) {
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: "background.paper",
        display: "flex",
        flexShrink: 0,
        px: 2,
        py: 1,
      }}
    >
      <TextField
        disabled={disabled}
        fullWidth
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        placeholder="Aa"
        value={content}
        size="small"
        variant="outlined"
      />
      <Tooltip title="Send">
        <span>
          <IconButton
            color="primary"
            disabled={!content || disabled}
            onClick={handleSend}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

ChatMessageAdd.propTypes = {
  disabled: PropTypes.bool,
  onSend: PropTypes.func,
};

ChatMessageAdd.defaultProps = {
  disabled: false,
};

export default ChatMessageAdd;

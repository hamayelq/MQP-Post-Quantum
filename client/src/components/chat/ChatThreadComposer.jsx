import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@material-ui/core";

const getFilteredSearchResults = (results, recipients) => {
  const recipientIds = recipients.reduce(
    (acc, recipient) => [...acc, recipient.id],
    []
  );

  return results.filter((result) => !recipientIds.includes(result.id));
};

const ChatThreadComposer = (props) => {
  const { onAddRecipient, onRemoveRecipient, recipients, ...other } = props;

  return (
    <Box
      sx={{
        flex: 12,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        // margin: "auto",
        p: 2,
      }}
      {...other}
    >
      <Typography color="textSecondary" variant="body1" align="center">
        Select a new contact or an existing chat to begin post quantumly
        communicating :)
      </Typography>
    </Box>
  );
};

ChatThreadComposer.propTypes = {
  onAddRecipient: PropTypes.func,
  onRemoveRecipient: PropTypes.func,
  recipients: PropTypes.array,
};

ChatThreadComposer.defaultProps = {
  recipients: [],
};

export default ChatThreadComposer;

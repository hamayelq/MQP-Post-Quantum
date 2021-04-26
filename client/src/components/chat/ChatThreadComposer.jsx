import { Box, Typography } from "@material-ui/core";

const ChatThreadComposer = () => {
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
    >
      <Typography color="textSecondary" variant="body1" align="center">
        Select a new contact or an existing chat to begin post quantumly
        communicating :)
      </Typography>
    </Box>
  );
};

ChatThreadComposer.propTypes = {};

ChatThreadComposer.defaultProps = {};

export default ChatThreadComposer;

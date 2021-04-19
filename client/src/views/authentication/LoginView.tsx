import React from "react";
import {
  Box,
  CardContent,
  Card,
  Container,
  Typography,
  Divider,
  Tooltip,
} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import { Login } from "../../components/auth/Login";
import Logo from "../../components/Logo";

interface Props {}

export const LoginView: React.FC<Props> = () => {
  return (
    // <Page className={classes.root} title="Login">
    <Box
      sx={{
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="sm" sx={{ py: "80px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 8,
          }}
        >
          <RouterLink to="/login">
            <Logo
              sx={{
                height: 40,
                width: 40,
              }}
            />
          </RouterLink>
        </Box>
        <Card>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 4,
            }}
          >
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <div>
                <Typography color="textPrimary" gutterBottom variant="h4">
                  Sign in
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  Sign in using your username and password
                </Typography>
              </div>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3,
              }}
            >
              <Login />
            </Box>
            <Divider sx={{ my: 3 }} />
            <Link
              component={RouterLink}
              to="/register"
              variant="body2"
              color="textSecondary"
            >
              Create new account
            </Link>
            <Tooltip
              title="Recovering password is currently not supported"
              aria-label="forgot password"
              placement="bottom-start"
            >
              <Link
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
                component={RouterLink}
                to="/login"
              >
                Forgot password
              </Link>
            </Tooltip>
          </CardContent>
        </Card>
      </Container>
    </Box>
    // </Page>
  );
};

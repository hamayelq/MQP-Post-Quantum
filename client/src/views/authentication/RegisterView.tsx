import {
  Box,
  Card,
  CardContent,
  Divider,
  Container,
  Link,
  Typography,
} from "@material-ui/core";
import Logo from "../../components/Logo";
import { Link as RouterLink } from "react-router-dom";
import { Register } from "../../components/auth/Register";

interface Props {}

export const RegisterView: React.FC<Props> = () => {
  return (
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
            mb: 8,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <RouterLink to="/">
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
                  Register
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  Register using your email, username, and password
                </Typography>
              </div>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3,
              }}
            >
              <Register />
            </Box>
            <Divider sx={{ my: 3 }} />
            <Link
              color="textSecondary"
              component={RouterLink}
              to="/login"
              variant="body2"
            >
              I already have an account
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

import { useState, useEffect } from "react";
import { apiRequest } from "../api/api";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

export default function Auth({ onAuth, initialMode = "login", onSwitchMode }) {
  const [mode, setMode] = useState(initialMode); // login | signup
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [goal, setGoal] = useState("SDE role");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => setMode(initialMode), [initialMode]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await apiRequest("/auth/signup", "POST", {
          fullName,
          email,
          password,
          gender,
          goal,
          experienceLevel: "0-2 years",
        });
      }

      const res = await apiRequest("/auth/login", "POST", { email, password });
      localStorage.setItem("token", res.token);
      onAuth();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode(m) {
    setMode(m);
    onSwitchMode?.(m);
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={10} md={6} lg={4}>
        <Paper elevation={6} sx={{ mt: 4, p: 3, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar>
            <Typography variant="h5">
              {mode === "signup" ? "Create account" : "Welcome back"}
            </Typography>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 1 }}>
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                <TextField
                  label="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      SelectProps={{ native: true }}
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="transgender">Transgender</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Goal"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </>
            )}

            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : mode === "signup"
                    ? "Create account"
                    : "Sign in"}
              </Button>
              <Link
                component="button"
                variant="body2"
                onClick={() =>
                  switchMode(mode === "login" ? "signup" : "login")
                }
              >
                {mode === "login"
                  ? "Create an account"
                  : "Already have an account?"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

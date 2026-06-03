import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { supabase } from "../../../supabase";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px 36px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 40px rgba(20, 57, 32, 0.12);
  animation: ${fadeUp} 0.35s ease;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 28px;
  font-size: 1.3rem;
  font-weight: 800;
  color: #2f5a2a;
  letter-spacing: -0.5px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a3318;
  text-align: center;
`;

const Sub = styled.p`
  margin: 0 0 28px;
  color: #7b8f7f;
  font-size: 0.9rem;
  text-align: center;
`;

const Field = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a3318;
  margin-bottom: 7px;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1.5px solid ${({ $error }) => ($error ? "#f5c2c2" : "#e8f2e8")};
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  color: #1a3318;
  background: #fafcfa;
  outline: none;
  &:focus { border-color: #2f5a2a; box-shadow: 0 0 0 3px rgba(47,90,42,0.08); background: white; }
`;

const ErrorMsg = styled.p`
  margin: 5px 0 0;
  font-size: 0.78rem;
  color: #a32d2d;
`;

const Btn = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: #2f5a2a;
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.2s;
  &:hover:not(:disabled) { background: #245026; }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

// Handles the password reset flow after the user clicks the link in their email.
function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase sends the reset token in the URL hash — listen for the session change.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setSessionReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Validates inputs and updates the user's password via Supabase.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => navigate("/login"), 2500);
  };

  if (!sessionReady) {
    return (
      <Page>
        <Card>
          <Logo>AFARMER™</Logo>
          <Title>Verifying link…</Title>
          <Sub>Please wait while we verify your reset link.</Sub>
        </Card>
      </Page>
    );
  }

  if (done) {
    return (
      <Page>
        <Card>
          <Logo>AFARMER™</Logo>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>✅</div>
            <Title>Password updated!</Title>
            <Sub>Redirecting you to sign in…</Sub>
          </div>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <Card>
        <Logo>AFARMER™</Logo>
        <Title>Set new password</Title>
        <Sub>Choose a strong password for your account.</Sub>

        <form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
            />
          </Field>
          <Field>
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              $error={!!error}
              required
            />
            {error && <ErrorMsg>⚠ {error}</ErrorMsg>}
          </Field>
          <Btn type="submit" disabled={loading}>
            {loading ? "Updating…" : "Update Password"}
          </Btn>
        </form>
      </Card>
    </Page>
  );
}

export default ResetPassword;

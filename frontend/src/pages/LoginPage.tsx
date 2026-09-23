import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await login.mutateAsync({ email, password });
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Log in</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? "Logging in..." : "Log in"}
      </button>
      {login.isError && <p role="alert">{login.error.message}</p>}
    </form>
  );
}

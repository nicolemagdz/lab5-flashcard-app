import { useMutation } from "@tanstack/react-query";
import type { LoginUserInput, RegisterUserInput } from "@flashcard/shared";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const { user, accessToken, setSession, clearSession } = useAuthStore();

  const login = useMutation({
    mutationFn: (input: LoginUserInput) => authApi.login(input),
    onSuccess: (result) => setSession(result.user, result.accessToken),
  });

  const register = useMutation({
    mutationFn: (input: RegisterUserInput) => authApi.register(input),
    onSuccess: (result) => setSession(result.user, result.accessToken),
  });

  return {
    user,
    isAuthenticated: Boolean(accessToken),
    login,
    register,
    logout: clearSession,
  };
}

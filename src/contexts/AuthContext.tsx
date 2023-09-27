import * as React from "react";

const AuthContext = React.createContext<{
  authData: AuthData | null;
  isLoading: boolean;
  setAuthData: React.Dispatch<React.SetStateAction<AuthData | null>>;
}>({
  authData: null,
  isLoading: true,
  setAuthData: () => {},
});

export type AuthData = {
  id: string;
  role: "admin" | "user" | "guest";
  email: string;
  name: string;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { authData, setAuthData, isLoading } = useAuth();
  return (
    <AuthContext.Provider
      value={{
        authData,
        isLoading,
        setAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Auth hook
export function useAuth() {
  const [isLoading, setLoading] = React.useState(true);
  const [authData, setAuthData] = React.useState<AuthData | null>({
    id: "",
    role: "guest",
    email: "",
    name: "",
  });

  React.useEffect(() => {
    const initializeAuth = async () => {
      const response = await fetch("/api/auth/check-auth", {
        credentials: "include",
      });
      if (response.ok) {
        const json = await response.json();
        setAuthData(json.data);
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  return { authData, setAuthData, isLoading };
}

// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { queryClient } from "../App";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Get current session on load
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user ?? null;

      if (sessionUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_banned")
          .eq("id", sessionUser.id)
          .single();

        if (profile?.is_banned) {
          await supabase.auth.signOut();
          setUser(null);
          setLoading(false);
          return;
        }
      }

      setUser(sessionUser);
      setLoading(false);
    };

    getSession();

    // ✅ Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ LOGIN
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  // ✅ SIGNUP
  const signup = async (email, password, username) => {
    // We can store the username as full_name  in the user's metadata for later retrieval
    // console.log(email, password, username);
    const full_name = username;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
      },
    });

    if (error) throw error;
    return data;
  };

  // ✅ LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to be used in all componetns
export const useAuth = () => {
  return useContext(AuthContext);
};

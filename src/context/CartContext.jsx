import { createContext, useEffect, useMemo, useState } from "react";
import { useUser } from "../hooks/useUser";

export const AppContext = createContext({});

export function CartProvider({ children }) {
  const { data: userData, isloading } = useUser();

  return (
    <AppContext.Provider
      value={{
        userData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}



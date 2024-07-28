// useToken.ts
import { useContext } from "react";
import TokenContext from "../Provider/TokenProvider";

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};

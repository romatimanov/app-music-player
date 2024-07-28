// src/hooks/useLikeContext.ts

import { useContext } from "react";
import { LikeContext } from "../Provider/LikeProvider";

export const useLikeContext = () => {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error("useLikeContext must be used within a LikeProvider");
  }
  return context;
};

import { useContext } from "react";
import { TrackContext } from "../Provider/TrackProvider";

export const useTrackContext = () => {
  const context = useContext(TrackContext);
  if (!context) {
    throw new Error("useTrack must be used within a TrackProvider");
  }
  return context;
};

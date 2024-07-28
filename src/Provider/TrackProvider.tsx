import { ReactNode, createContext, useState } from "react";
import { Track } from "../models/models";

export interface TrackContextType {
  currentTrack: Track | null;
  playTrack: (track: Track) => void;
}

export const TrackContext = createContext<TrackContextType | undefined>(
  undefined
);

export const TrackProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    localStorage.setItem("currentTrack", JSON.stringify(track));
  };

  return (
    <TrackContext.Provider value={{ currentTrack, playTrack }}>
      {children}
    </TrackContext.Provider>
  );
};

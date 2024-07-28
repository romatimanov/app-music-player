import React, { createContext, useState, ReactNode, useEffect } from "react";
import {
  useAddLikeMutation,
  useDeleteLikeMutation,
  useGetFavoritreSongsQuery,
} from "../store/action/actionApi";

export type LikeContextType = {
  likedTracks: Set<string>;
  toggleLike: (trackId: string, trackName: string) => Promise<void>;
};

export const LikeContext = createContext<LikeContextType | undefined>(
  undefined
);

export const LikeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [addLike] = useAddLikeMutation();
  const [deleteLike] = useDeleteLikeMutation();
  const { data: tracks, refetch } = useGetFavoritreSongsQuery();

  useEffect(() => {
    const loadLikedTracks = () => {
      if (tracks) {
        const trackIds = new Set(tracks?.songLikes.map((track) => track.id));
        setLikedTracks(trackIds);
      }
    };

    loadLikedTracks();
  }, [tracks]);

  const toggleLike = async (trackId: string) => {
    const updatedLikedTracks = new Set(likedTracks);
    if (updatedLikedTracks.has(trackId)) {
      await deleteLike({ id: trackId });
      updatedLikedTracks.delete(trackId);
    } else {
      await addLike({ id: trackId });
      updatedLikedTracks.add(trackId);
    }
    setLikedTracks(updatedLikedTracks);
    refetch();
    console.log("Updated liked tracks:", updatedLikedTracks);
  };

  return (
    <LikeContext.Provider value={{ likedTracks, toggleLike }}>
      {children}
    </LikeContext.Provider>
  );
};

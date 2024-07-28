import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MusicState, PlaylistsType } from "../../models/models";

export const musicApi = createApi({
  reducerPath: "musicApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTracks: builder.query<MusicState, void>({
      query: () => `songs`,
    }),
    getPlaylists: builder.query<PlaylistsType[], void>({
      query: () => `users/playlists`,
    }),
    getPlaylistsId: builder.query<PlaylistsType, { id: string }>({
      query: ({ id }) => `playlists/${id}`,
    }),
    getFavoritreSongs: builder.query<MusicState, void>({
      query: () => `users/likes`,
    }),
    daeletePlaylists: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `playlists/${id}`,
        method: "DELETE",
      }),
    }),
    login: builder.mutation<
      { access_token: string },
      { username: string; password: string }
    >({
      query: ({ username, password }) => ({
        url: `auth/login`,
        method: "POST",
        body: { username, password },
      }),
    }),
    deleteSongPlaylists: builder.mutation<void, { id: string; songId: string }>(
      {
        query: ({ id, songId }) => ({
          url: `playlists/${id}/remove/${songId}`,
          method: "POST",
        }),
      }
    ),
    addPlaylists: builder.mutation<void, { name: string }>({
      query: (newPlaylist) => ({
        url: `playlists`,
        method: "POST",
        body: newPlaylist,
      }),
    }),
    addSongPlaylists: builder.mutation<void, { id: string; songId: string }>({
      query: ({ id, songId }) => ({
        url: `playlists/${id}/add/${songId}`,
        method: "POST",
      }),
    }),
    addLike: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `songs/${id}/like`,
        method: "POST",
      }),
    }),
    deleteLike: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `songs/${id}/unlike`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetTracksQuery,
  useAddPlaylistsMutation,
  useGetPlaylistsQuery,
  useGetFavoritreSongsQuery,
  useDaeletePlaylistsMutation,
  useGetPlaylistsIdQuery,
  useAddSongPlaylistsMutation,
  useDeleteSongPlaylistsMutation,
  useAddLikeMutation,
  useDeleteLikeMutation,
  useLoginMutation,
} = musicApi;

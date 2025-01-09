import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/resetpassword`,
        method: "POST",
        body: data,
      }),
    }),
    forgotPasswordUpdate: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/resetpassword`,
        method: "PUT",
        body: data,
      }),
    }),
    oauth: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/oauth`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useForgotPasswordUpdateMutation,
  useOauthMutation,
} = usersApiSlice;

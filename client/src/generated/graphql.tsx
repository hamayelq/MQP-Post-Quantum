import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: "Query";
  bye: Scalars["String"];
  getUsers: Array<User>;
  me?: Maybe<User>;
  getMessages: GetMessageResponse;
  getChatRepo: Chat;
  getChats: Array<Chat>;
  getUserObject: Array<User>;
  getUserRepo: User;
};

export type QueryGetUsersArgs = {
  uuid: Scalars["String"];
};

export type QueryGetMessagesArgs = {
  userId: Scalars["String"];
  chatId: Scalars["String"];
};

export type QueryGetChatsArgs = {
  userId: Scalars["String"];
};

export type User = {
  __typename?: "User";
  uuid: Scalars["String"];
  publicKey: Scalars["String"];
  encryptedPrivateKey: Scalars["String"];
  username: Scalars["String"];
  email: Scalars["String"];
  messages: Array<Message>;
  chats: Array<Chat>;
};

export type Message = {
  __typename?: "Message";
  uuid: Scalars["String"];
  sender: User;
  chat: Chat;
  fromName: Scalars["String"];
  toName: Scalars["String"];
  content: Scalars["String"];
  me: Scalars["Boolean"];
  date: Scalars["DateTime"];
};

export type Chat = {
  __typename?: "Chat";
  uuid: Scalars["String"];
  name: Scalars["String"];
  messages: Message;
  members: Array<User>;
  lastMessage: Scalars["String"];
  pendingRequest: Scalars["Boolean"];
  sentByUuid: Scalars["String"];
  sentBySymKey: Scalars["String"];
  acceptedBySymKey: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
};

export type GetMessageResponse = {
  __typename?: "GetMessageResponse";
  uuid: Scalars["String"];
  lastMessage: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  members: Array<User>;
  messages: Array<Message>;
};

export type Mutation = {
  __typename?: "Mutation";
  revokeRefreshTokensForUser: Scalars["Boolean"];
  login: LoginResponse;
  logout: Scalars["Boolean"];
  register: Scalars["Boolean"];
  createMessage: Scalars["Boolean"];
  createNewMessage: Message;
  triggerSubscription: Scalars["Boolean"];
  createChat: Scalars["Boolean"];
  createNewChat: Scalars["Boolean"];
  acceptRequest: Scalars["Boolean"];
  denyRequest: Scalars["Boolean"];
};

export type MutationRevokeRefreshTokensForUserArgs = {
  userId: Scalars["String"];
};

export type MutationLoginArgs = {
  password: Scalars["String"];
  username: Scalars["String"];
};

export type MutationRegisterArgs = {
  encryptedPrivateKey: Scalars["String"];
  publicKey: Scalars["String"];
  password: Scalars["String"];
  username: Scalars["String"];
  email: Scalars["String"];
};

export type MutationCreateMessageArgs = {
  userId: Scalars["String"];
  content: Scalars["String"];
  chatId: Scalars["String"];
};

export type MutationCreateChatArgs = {
  acceptedBySymKey: Scalars["String"];
  sentBySymKey: Scalars["String"];
  userId: Scalars["String"];
  memberIds: Array<Scalars["String"]>;
};

export type MutationAcceptRequestArgs = {
  encryptedSymKey: Scalars["String"];
  chatId: Scalars["String"];
};

export type MutationDenyRequestArgs = {
  chatId: Scalars["String"];
};

export type LoginResponse = {
  __typename?: "LoginResponse";
  accessToken: Scalars["String"];
  encryptedPrivateKey: Scalars["String"];
  publicKey: Scalars["String"];
  user: User;
};

export type AcceptRequestMutationVariables = Exact<{
  chatId: Scalars["String"];
  encryptedSymKey: Scalars["String"];
}>;

export type AcceptRequestMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "acceptRequest"
>;

export type ByeQueryVariables = Exact<{ [key: string]: never }>;

export type ByeQuery = { __typename?: "Query" } & Pick<Query, "bye">;

export type CreateChatMutationVariables = Exact<{
  memberIds: Array<Scalars["String"]> | Scalars["String"];
  userId: Scalars["String"];
  sentBySymKey: Scalars["String"];
  acceptedBySymKey: Scalars["String"];
}>;

export type CreateChatMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "createChat"
>;

export type CreateMessageMutationVariables = Exact<{
  chatId: Scalars["String"];
  content: Scalars["String"];
  userId: Scalars["String"];
}>;

export type CreateMessageMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "createMessage"
>;

export type DenyRequestMutationVariables = Exact<{
  chatId: Scalars["String"];
}>;

export type DenyRequestMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "denyRequest"
>;

export type GetChatsQueryVariables = Exact<{
  userId: Scalars["String"];
}>;

export type GetChatsQuery = { __typename?: "Query" } & {
  getChats: Array<
    { __typename?: "Chat" } & Pick<
      Chat,
      | "uuid"
      | "name"
      | "sentByUuid"
      | "lastMessage"
      | "pendingRequest"
      | "sentBySymKey"
      | "acceptedBySymKey"
      | "updatedAt"
    > & {
        members: Array<
          { __typename?: "User" } & Pick<
            User,
            "uuid" | "username" | "publicKey"
          >
        >;
      }
  >;
};

export type GetMessagesQueryVariables = Exact<{
  chatId: Scalars["String"];
  userId: Scalars["String"];
}>;

export type GetMessagesQuery = { __typename?: "Query" } & {
  getMessages: { __typename?: "GetMessageResponse" } & Pick<
    GetMessageResponse,
    "uuid"
  > & {
      messages: Array<
        { __typename?: "Message" } & Pick<
          Message,
          "uuid" | "date" | "content" | "me"
        > & {
            sender: { __typename?: "User" } & Pick<User, "uuid" | "username">;
          }
      >;
    };
};

export type GetUsersQueryVariables = Exact<{
  uuid: Scalars["String"];
}>;

export type GetUsersQuery = { __typename?: "Query" } & {
  getUsers: Array<
    { __typename?: "User" } & Pick<User, "uuid" | "username" | "publicKey">
  >;
};

export type LoginMutationVariables = Exact<{
  username: Scalars["String"];
  password: Scalars["String"];
}>;

export type LoginMutation = { __typename?: "Mutation" } & {
  login: { __typename?: "LoginResponse" } & Pick<
    LoginResponse,
    "accessToken" | "encryptedPrivateKey" | "publicKey"
  > & { user: { __typename?: "User" } & Pick<User, "uuid" | "username"> };
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "logout"
>;

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: "Query" } & {
  me?: Maybe<{ __typename?: "User" } & Pick<User, "uuid" | "username">>;
};

export type RegisterMutationVariables = Exact<{
  email: Scalars["String"];
  username: Scalars["String"];
  password: Scalars["String"];
  publicKey: Scalars["String"];
  encryptedPrivateKey: Scalars["String"];
}>;

export type RegisterMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "register"
>;

export const AcceptRequestDocument = gql`
  mutation AcceptRequest($chatId: String!, $encryptedSymKey: String!) {
    acceptRequest(chatId: $chatId, encryptedSymKey: $encryptedSymKey)
  }
`;
export type AcceptRequestMutationFn = Apollo.MutationFunction<
  AcceptRequestMutation,
  AcceptRequestMutationVariables
>;

/**
 * __useAcceptRequestMutation__
 *
 * To run a mutation, you first call `useAcceptRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptRequestMutation, { data, loading, error }] = useAcceptRequestMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      encryptedSymKey: // value for 'encryptedSymKey'
 *   },
 * });
 */
export function useAcceptRequestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AcceptRequestMutation,
    AcceptRequestMutationVariables
  >
) {
  return Apollo.useMutation<
    AcceptRequestMutation,
    AcceptRequestMutationVariables
  >(AcceptRequestDocument, baseOptions);
}
export type AcceptRequestMutationHookResult = ReturnType<
  typeof useAcceptRequestMutation
>;
export type AcceptRequestMutationResult = Apollo.MutationResult<AcceptRequestMutation>;
export type AcceptRequestMutationOptions = Apollo.BaseMutationOptions<
  AcceptRequestMutation,
  AcceptRequestMutationVariables
>;
export const ByeDocument = gql`
  query Bye {
    bye
  }
`;

/**
 * __useByeQuery__
 *
 * To run a query within a React component, call `useByeQuery` and pass it any options that fit your needs.
 * When your component renders, `useByeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useByeQuery({
 *   variables: {
 *   },
 * });
 */
export function useByeQuery(
  baseOptions?: Apollo.QueryHookOptions<ByeQuery, ByeQueryVariables>
) {
  return Apollo.useQuery<ByeQuery, ByeQueryVariables>(ByeDocument, baseOptions);
}
export function useByeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ByeQuery, ByeQueryVariables>
) {
  return Apollo.useLazyQuery<ByeQuery, ByeQueryVariables>(
    ByeDocument,
    baseOptions
  );
}
export type ByeQueryHookResult = ReturnType<typeof useByeQuery>;
export type ByeLazyQueryHookResult = ReturnType<typeof useByeLazyQuery>;
export type ByeQueryResult = Apollo.QueryResult<ByeQuery, ByeQueryVariables>;
export const CreateChatDocument = gql`
  mutation CreateChat(
    $memberIds: [String!]!
    $userId: String!
    $sentBySymKey: String!
    $acceptedBySymKey: String!
  ) {
    createChat(
      memberIds: $memberIds
      userId: $userId
      sentBySymKey: $sentBySymKey
      acceptedBySymKey: $acceptedBySymKey
    )
  }
`;
export type CreateChatMutationFn = Apollo.MutationFunction<
  CreateChatMutation,
  CreateChatMutationVariables
>;

/**
 * __useCreateChatMutation__
 *
 * To run a mutation, you first call `useCreateChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChatMutation, { data, loading, error }] = useCreateChatMutation({
 *   variables: {
 *      memberIds: // value for 'memberIds'
 *      userId: // value for 'userId'
 *      sentBySymKey: // value for 'sentBySymKey'
 *      acceptedBySymKey: // value for 'acceptedBySymKey'
 *   },
 * });
 */
export function useCreateChatMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateChatMutation,
    CreateChatMutationVariables
  >
) {
  return Apollo.useMutation<CreateChatMutation, CreateChatMutationVariables>(
    CreateChatDocument,
    baseOptions
  );
}
export type CreateChatMutationHookResult = ReturnType<
  typeof useCreateChatMutation
>;
export type CreateChatMutationResult = Apollo.MutationResult<CreateChatMutation>;
export type CreateChatMutationOptions = Apollo.BaseMutationOptions<
  CreateChatMutation,
  CreateChatMutationVariables
>;
export const CreateMessageDocument = gql`
  mutation CreateMessage(
    $chatId: String!
    $content: String!
    $userId: String!
  ) {
    createMessage(chatId: $chatId, content: $content, userId: $userId)
  }
`;
export type CreateMessageMutationFn = Apollo.MutationFunction<
  CreateMessageMutation,
  CreateMessageMutationVariables
>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      content: // value for 'content'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useCreateMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateMessageMutation,
    CreateMessageMutationVariables
  >
) {
  return Apollo.useMutation<
    CreateMessageMutation,
    CreateMessageMutationVariables
  >(CreateMessageDocument, baseOptions);
}
export type CreateMessageMutationHookResult = ReturnType<
  typeof useCreateMessageMutation
>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<
  CreateMessageMutation,
  CreateMessageMutationVariables
>;
export const DenyRequestDocument = gql`
  mutation DenyRequest($chatId: String!) {
    denyRequest(chatId: $chatId)
  }
`;
export type DenyRequestMutationFn = Apollo.MutationFunction<
  DenyRequestMutation,
  DenyRequestMutationVariables
>;

/**
 * __useDenyRequestMutation__
 *
 * To run a mutation, you first call `useDenyRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDenyRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [denyRequestMutation, { data, loading, error }] = useDenyRequestMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useDenyRequestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DenyRequestMutation,
    DenyRequestMutationVariables
  >
) {
  return Apollo.useMutation<DenyRequestMutation, DenyRequestMutationVariables>(
    DenyRequestDocument,
    baseOptions
  );
}
export type DenyRequestMutationHookResult = ReturnType<
  typeof useDenyRequestMutation
>;
export type DenyRequestMutationResult = Apollo.MutationResult<DenyRequestMutation>;
export type DenyRequestMutationOptions = Apollo.BaseMutationOptions<
  DenyRequestMutation,
  DenyRequestMutationVariables
>;
export const GetChatsDocument = gql`
  query GetChats($userId: String!) {
    getChats(userId: $userId) {
      uuid
      name
      sentByUuid
      lastMessage
      pendingRequest
      sentBySymKey
      acceptedBySymKey
      updatedAt
      members {
        uuid
        username
        publicKey
      }
    }
  }
`;

/**
 * __useGetChatsQuery__
 *
 * To run a query within a React component, call `useGetChatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetChatsQuery(
  baseOptions: Apollo.QueryHookOptions<GetChatsQuery, GetChatsQueryVariables>
) {
  return Apollo.useQuery<GetChatsQuery, GetChatsQueryVariables>(
    GetChatsDocument,
    baseOptions
  );
}
export function useGetChatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetChatsQuery,
    GetChatsQueryVariables
  >
) {
  return Apollo.useLazyQuery<GetChatsQuery, GetChatsQueryVariables>(
    GetChatsDocument,
    baseOptions
  );
}
export type GetChatsQueryHookResult = ReturnType<typeof useGetChatsQuery>;
export type GetChatsLazyQueryHookResult = ReturnType<
  typeof useGetChatsLazyQuery
>;
export type GetChatsQueryResult = Apollo.QueryResult<
  GetChatsQuery,
  GetChatsQueryVariables
>;
export const GetMessagesDocument = gql`
  query GetMessages($chatId: String!, $userId: String!) {
    getMessages(chatId: $chatId, userId: $userId) {
      uuid
      messages {
        uuid
        date
        content
        me
        sender {
          uuid
          username
        }
      }
    }
  }
`;

/**
 * __useGetMessagesQuery__
 *
 * To run a query within a React component, call `useGetMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetMessagesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetMessagesQuery,
    GetMessagesQueryVariables
  >
) {
  return Apollo.useQuery<GetMessagesQuery, GetMessagesQueryVariables>(
    GetMessagesDocument,
    baseOptions
  );
}
export function useGetMessagesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMessagesQuery,
    GetMessagesQueryVariables
  >
) {
  return Apollo.useLazyQuery<GetMessagesQuery, GetMessagesQueryVariables>(
    GetMessagesDocument,
    baseOptions
  );
}
export type GetMessagesQueryHookResult = ReturnType<typeof useGetMessagesQuery>;
export type GetMessagesLazyQueryHookResult = ReturnType<
  typeof useGetMessagesLazyQuery
>;
export type GetMessagesQueryResult = Apollo.QueryResult<
  GetMessagesQuery,
  GetMessagesQueryVariables
>;
export const GetUsersDocument = gql`
  query GetUsers($uuid: String!) {
    getUsers(uuid: $uuid) {
      uuid
      username
      publicKey
    }
  }
`;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useGetUsersQuery(
  baseOptions: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>
) {
  return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(
    GetUsersDocument,
    baseOptions
  );
}
export function useGetUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUsersQuery,
    GetUsersQueryVariables
  >
) {
  return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(
    GetUsersDocument,
    baseOptions
  );
}
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<
  typeof useGetUsersLazyQuery
>;
export type GetUsersQueryResult = Apollo.QueryResult<
  GetUsersQuery,
  GetUsersQueryVariables
>;
export const LoginDocument = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      encryptedPrivateKey
      publicKey
      user {
        uuid
        username
      }
    }
  }
`;
export type LoginMutationFn = Apollo.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >
) {
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    baseOptions
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;
export type LogoutMutationFn = Apollo.MutationFunction<
  LogoutMutation,
  LogoutMutationVariables
>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LogoutMutation,
    LogoutMutationVariables
  >
) {
  return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    baseOptions
  );
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>;
export const MeDocument = gql`
  query Me {
    me {
      uuid
      username
    }
  }
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>
) {
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(
    MeDocument,
    baseOptions
  );
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const RegisterDocument = gql`
  mutation Register(
    $email: String!
    $username: String!
    $password: String!
    $publicKey: String!
    $encryptedPrivateKey: String!
  ) {
    register(
      email: $email
      username: $username
      password: $password
      publicKey: $publicKey
      encryptedPrivateKey: $encryptedPrivateKey
    )
  }
`;
export type RegisterMutationFn = Apollo.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      username: // value for 'username'
 *      password: // value for 'password'
 *      publicKey: // value for 'publicKey'
 *      encryptedPrivateKey: // value for 'encryptedPrivateKey'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >
) {
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    baseOptions
  );
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;

import { GET_USER } from "@/lib/request";
import { useSession } from "next-auth/react";
import React, { createContext, useContext } from "react";
import { useQuery } from "urql";

const UserContext = createContext();

function UserProvider({ children }) {
  const { data: session } = useSession();

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: GET_USER,
    variables: {
      email: session?.user?.email,
    },
  });

  return (
    <UserContext.Provider
      value={{ refreshApp: () => reexecuteQuery(), user: data?.getUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

export default UserProvider;

import { useMutation } from "@apollo/client";
import React from "react";
import { LOGIN_MUTATION } from "./UserMutations";
var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
    type: !!localStorage.getItem("user_type")?localStorage.getItem("user_type"):null,
    id: !!localStorage.getItem("id")?localStorage.getItem("id"):null,
    fullName: !!localStorage.getItem("full_name")?localStorage.getItem("full_name"):null,
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError,data) {
  setError(false);
  setIsLoading(true);

  if (data) {
    console.log(data);
    localStorage.setItem('id_token', data.tokenAuth.token);
    console.log(data.tokenAuth.user.karshenas);
    if(data.tokenAuth.user.karshenas)
    {
      localStorage.setItem('user_type','karshenas');
      localStorage.setItem('id',data.tokenAuth.user.karshenas.id);
      localStorage.setItem('full_name',data.tokenAuth.user.karshenas.firstName + ' ' + data.tokenAuth.user.karshenas.lastName)
    }
    else if(data.tokenAuth.user.arzyab)
    {
      localStorage.setItem('user_type','arzyab');
      localStorage.setItem('id',data.tokenAuth.user.arzyab.id);
      localStorage.setItem('full_name',data.tokenAuth.user.arzyab.firstName + ' ' + data.tokenAuth.user.arzyab.lastName)

    }
    setError(null)
    setIsLoading(false)
    dispatch({ type: 'LOGIN_SUCCESS' })
    history.push('/app/dashboard')

  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  localStorage.removeItem("user_type");
  localStorage.removeItem("id");
  localStorage.removeItem("full_name");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}

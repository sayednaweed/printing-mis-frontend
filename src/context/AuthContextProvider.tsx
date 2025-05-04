// import React, { createContext, useContext, useEffect, useReducer } from "react";
// import axiosClient from "../lib/axois-client";
// import { User } from "@/database/tables";
// import {
//   getConfiguration,
//   removeToken,
//   returnPermissionsMap,
//   setToken,
// } from "@/lib/utils";
// import { StatusEnum } from "@/lib/constants";
// // import secureLocalStorage from "react-secure-storage";
// interface AuthState {
//   authenticated: boolean;
//   user: User;
//   loading: boolean;
//   loginUser: (
//     email: string,
//     password: string,
//     rememberMe: boolean
//   ) => Promise<void>;
//   logoutUser: () => Promise<void>;
//   setUser: (user: User) => Promise<void>;
// }
// type Action =
//   | { type: "LOGIN"; payload: User }
//   | { type: "EDIT"; payload: User }
//   | { type: "LOGOUT" }
//   | { type: "STOP_LOADING" };

// type Dispatch = React.Dispatch<Action>;
// const initUser: User = {
//   id: "",
//   full_name: "",
//   username: "",
//   email: "",
//   status: {
//     id: StatusEnum.blocked,
//     name: "",
//     created_at: "",
//   },
//   grant: false,
//   profile: "",
//   role: { role: 3, name: "user" },
//   job: "",
//   contact: "",
//   destination: "",
//   permissions: new Map(),
//   created_at: "",
//   gender: "",
// };
// const initialState: AuthState = {
//   user: initUser,
//   authenticated: false,
//   loading: true,
//   loginUser: () => Promise.resolve(),
//   logoutUser: () => Promise.resolve(),
//   setUser: () => Promise.resolve(),
// };
// const StateContext = createContext<AuthState>(initialState);
// const DispatchContext = createContext<React.Dispatch<Action>>(() => {});

// function reducer(state: AuthState, action: Action) {
//   switch (action.type) {
//     case "LOGIN":
//       return {
//         ...state,
//         authenticated: true,
//         user: action.payload,
//         loading: false,
//       };
//     case "LOGOUT":
//       removeToken();
//       return {
//         ...state,
//         authenticated: false,
//         user: initUser,
//         loading: false,
//       };
//     case "EDIT":
//       return {
//         ...state,
//         user: action.payload,
//       };
//     case "STOP_LOADING":
//       return {
//         ...state,
//         loading: false,
//       };
//     default:
//       throw new Error("Unknown action type");
//   }
// }
// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   const loadUser = async () => {
//     try {
//       const configuration = getConfiguration();
//       if (configuration?.token === null || configuration?.token === undefined) {
//         dispatch({ type: "STOP_LOADING" });
//         return;
//       }
//       const response = await axiosClient.get(`auth-${configuration?.type}`, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.status === 200) {
//         const user = response.data.user;
//         if (user != null) {
//           user.permissions = returnPermissionsMap(response.data?.permissions);
//         }
//         dispatch({ type: "LOGIN", payload: user });
//       }
//     } catch (err) {
//       console.log(err);
//       dispatch({ type: "LOGOUT" });
//     }
//   };
//   useEffect(() => {
//     loadUser();
//   }, []);
//   const loginUser = async (
//     email: string,
//     password: string,
//     rememberMe: boolean
//   ): Promise<any> => {
//     let response: any = null;
//     try {
//       const formData = new FormData();
//       formData.append("email", email);
//       formData.append("password", password);
//       response = await axiosClient.post("auth-user", formData);
//       if (response.status == 200) {
//         if (rememberMe) {
//           setToken({
//             token: response.data.token,
//             type: "user",
//           });
//         }
//         const user = response.data.user as User;
//         if (user != null)
//           user.permissions = returnPermissionsMap(response.data?.permissions);
//         dispatch({ type: "LOGIN", payload: user });
//       }
//     } catch (error: any) {
//       response = error;
//       console.log(error);
//     }
//     return response;
//   };

//   const setUser = async (user: User): Promise<any> => {
//     try {
//       if (user != null || user != undefined)
//         dispatch({ type: "EDIT", payload: user });
//     } catch (error: any) {
//       console.log(error);
//     }
//   };

//   const logoutUser = async (): Promise<void> => {
//     try {
//       await axiosClient.post("auth-logout");
//     } catch (error: any) {
//       console.log(error);
//     }
//     dispatch({ type: "LOGOUT" });
//   };

//   return (
//     <StateContext.Provider
//       value={{
//         ...state,
//         loginUser,
//         logoutUser,
//         setUser,
//       }}
//     >
//       <DispatchContext.Provider value={dispatch}>
//         {children}
//       </DispatchContext.Provider>
//     </StateContext.Provider>
//   );
// };
// // export const useAuthState = () => useContext(StateContext);
// export const useUserAuthState = () => {
//   const context = useContext(StateContext);

//   if (context === undefined)
//     throw new Error("useAuthState must be used within a useUserAuthState");

//   const { user, setUser, authenticated, loading, loginUser, logoutUser } =
//     context;
//   const currentUser = user as User;
//   return {
//     user: currentUser,
//     setUser,
//     authenticated,
//     loading,
//     loginUser,
//     logoutUser,
//   };
// };

// export const useAuthDispatch: () => Dispatch = () =>
//   useContext(DispatchContext);

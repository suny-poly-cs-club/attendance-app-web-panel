// import {create} from 'zustand';

// export type AuthUser = {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   isAdmin: boolean;
// };

// type AuthStore = {
//   user: AuthUser | null;

//   actions: {
//     login: (creds: {email: string; password: string}) => void;
//     logout: () => void;
//   }
// };

// const useAuthStore = create<AuthStore>(set => ({
//   user: null,
//   actions: {
//     // TODO: is this where I would make the API request?
//     login: ({email, password}) => {},
//     logout: () => set({user: null}),
//   },
// }));

// export const useAuthStoreActions = () => useAuthStore(state => state.actions);
// export const useAuthUser = () => useAuthStore(state => state.user);

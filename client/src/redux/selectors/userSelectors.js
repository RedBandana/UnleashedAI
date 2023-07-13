export const fetchUsers = (state) => state.users.users;
export const fetchUsersLoading = (state) => state.users.loading;
export const fetchUsersError = (state) => state.users.error;

export const fetchUser = (state) => state.users.user;
export const fetchUserLoading = (state) => state.users.userLoading;
export const fetchUserError = (state) => state.users.userError;

export const createUserLoading = (state) => state.users.createUserLoading;
export const createUserError = (state) => state.users.createUserError;
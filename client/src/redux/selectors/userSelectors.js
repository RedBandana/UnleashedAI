export const getUsers = (state) => state.users.users;
export const getUsersLoading = (state) => state.users.loading;
export const getUsersError = (state) => state.users.error;

export const getUser = (state) => state.users.user;
export const getUserLoading = (state) => state.users.userLoading;
export const getUserError = (state) => state.users.userError;

export const createUserLoading = (state) => state.users.createUserLoading;
export const createUserError = (state) => state.users.createUserError;
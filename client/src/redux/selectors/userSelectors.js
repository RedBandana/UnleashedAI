
export const fetchUserValue = (state) => state.users.user;
export const fetchUserLoading = (state) => state.users.userLoading;
export const fetchUserError = (state) => state.users.userError;

export const createUserLoading = (state) => state.users.createUserLoading;
export const createUserError = (state) => state.users.createUserError;

export const createGuestLoading = (state) => state.users.createGuestLoading;
export const createGuestError = (state) => state.users.createGuestError;

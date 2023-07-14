export const fetchChats = (state) => state.chats.chats;
export const fetchChatsLoading = (state) => state.chats.loading;
export const fetchChatsError = (state) => state.chats.error;

export const fetchChat = (state) => state.chats.chat;
export const fetchChatLoading = (state) => state.chats.chatLoading;
export const fetchChatError = (state) => state.chats.chatError;

export const editChatLoading = (state) => state.chats.editChatLoading;
export const editChatError = (state) => state.chats.editChatError;

export const createChatLoading = (state) => state.chats.createChatLoading;
export const createChatError = (state) => state.chats.createChatError;

export const deleteChatLoading = (state) => state.chats.deleteChatLoading;
export const deleteChatError = (state) => state.chats.deleteChatError;
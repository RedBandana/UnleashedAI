export const fetchChatsValue = (state) => state.chats.chats;
export const fetchChatsLoading = (state) => state.chats.loading;
export const fetchChatsError = (state) => state.chats.error;

export const fetchChatValue= (state) => state.chats.chat;
export const fetchChatLoading = (state) => state.chats.chatLoading;
export const fetchChatError = (state) => state.chats.chatError;

export const editChatLoading = (state) => state.chats.editChatLoading;
export const editChatError = (state) => state.chats.editChatError;

export const createChatValue = (state) => state.chats.createChat;
export const createChatLoading = (state) => state.chats.createChatLoading;
export const createChatError = (state) => state.chats.createChatError;

export const deleteChatValue = (state) => state.chats.deleteChat;
export const deleteChatLoading = (state) => state.chats.deleteChatLoading;
export const deleteChatError = (state) => state.chats.deleteChatError;
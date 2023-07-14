export const fetchMessages = (state) => state.messages.messages;
export const fetchMessagesLoading = (state) => state.messages.loading;
export const fetchMessagesError = (state) => state.messages.error;

export const fetchMessage = (state) => state.messages.message;
export const fetchMessageLoading = (state) => state.messages.messageLoading;
export const fetchMessageError = (state) => state.messages.messageError;

export const fetchChoices = (state) => state.messages.choices;
export const fetchChoicesLoading = (state) => state.messages.choicesLoading;
export const fetchChoicesError = (state) => state.messages.choicesError;

export const fetchChoice = (state) => state.messages.choice;
export const fetchChoiceLoading = (state) => state.messages.choiceLoading;
export const fetchChoiceError = (state) => state.messages.choiceError;

export const createMessageLoading = (state) => state.messages.createMessageLoading;
export const createMessageError = (state) => state.messages.createMessageError;

export const deleteMessageLoading = (state) => state.messages.deleteMessageLoading;
export const deleteMessageError = (state) => state.messages.deleteMessageError;
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function sendChatCompletion(settings) {
  let apiMessages = [];
  apiMessages.push({ role: "system", content: settings.system })
  
  settings.history.forEach(message => {
    const role = message.isUser ? "user" : "assistant";
    message.texts.forEach(text => {
      apiMessages.push({role: role, content: text})
    })
  });

  const completion = await openai.createChatCompletion({
    model: settings.model,
    messages: apiMessages,
    temperature: settings.temperature,
    top_p: settings.topP,
    n: settings.quantity,
    stream: settings.stream,
    stop: settings.stop,
    max_tokens: settings.maxTokens,
    presence_penalty: settings.presencePenalty,
    frequency_penalty: settings.frequencyPenalty,
    logit_bias: settings.logitBias,
    user: settings.user,
  });

  let responses = [];
  completion.data.choices.forEach(choice => {
    responses.push(choice.message.content);
  });

  return responses;
}

async function sendCompletion(settings) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: settings.prompt,
    temperature: 0,
    max_tokens: 7,
  });

  let response = completion.data.choices[0].text;
  return response;
}

async function trySendRequest(callback, param1) {
  try {
    let response = await callback(param1);

    if (response == null)
      response = ["Error: Something went wrong."];

    return response;

  } catch (error) {
    handleError(error);

    return [`Error: ${error.message}`];
  }
}

function handleError(error) {
  if (error.response) {
    console.log(error.response.status);
    console.log(error.response.data);
  } else {
    console.log(error.message);
  }
}

export { sendChatCompletion, sendCompletion, trySendRequest }
// https://platform.openai.com/docs/api-reference/authentication?lang=node.js
// https://github.com/openai/openai-node
// https://platform.openai.com/docs/guides/images/usage?lang=node.js

// fs is server side, should use browser's built-in `FileReader` and `FileWriter` APIs
// const fs = require('fs');
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

async function createImage(settings) {
  const response = await openai.createImage({
    prompt: settings.prompt,
    n: settings.quantity,
    size: settings.size,
  });

  let imageUrl = response.data.data[0].url;
  return imageUrl;
}

async function editImage(settings) {
  const response = await openai.createImageEdit(
    // fs.createReadStream(settings.image),
    // fs.createReadStream(settings.maskimage),
    settings.prompt,
    settings.quantity,
    settings.size
  );

  let imageUrl = response.data.data[0].url;
  return imageUrl;
}

async function varyImage(settings) {
  const response = await openai.createImageVariation(
    // fs.createReadStream(settings.image),y
    settings.quantity,
    settings.size
  );

  let imageUrl = response.data.data[0].url;
  return imageUrl;
}

async function trySendRequest(callback, param1) {
  try {
    let response = await callback(param1);

    if (response == null)
      response = ["Error"];

    return response;

  } catch (error) {
    handleError(error);

    return ["Error"];
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

export { sendChatCompletion, sendCompletion, trySendRequest, createImage, editImage, varyImage }
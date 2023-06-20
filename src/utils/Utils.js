function parseToRightType(obj, property, value) {
  if (typeof obj[property] == "number") {
    return parseFloat(value);
  }
  else if (typeof obj[property] == "boolean") {
    return Boolean(value);
  }
  else {
    return value;
  }
}

function getModelMaxTokens(model) {
  if (model === 'gpt-4') {
    return 8192;
  }
  else if (model === 'gpt-4-32k') {
    return 32768;
  }
  else if (model === 'gpt-3.5-turbo') {
    return 4096;
  }
  else if (model === 'code-davinci-002') {
    return 80001;
  }
  else if (model === 'gpt-3.5-turbo-16k') {
    return 16384;
  }
  else {
    return null;
  }
}

export { parseToRightType, getModelMaxTokens }
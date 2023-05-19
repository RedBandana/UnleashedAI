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
  if (model === 'gpt-4' || model === 'gpt-4-0314') {
    return 8192;
  }
  else if (model === 'gpt-4-32k' || model === 'gpt-4-32k-0314') {
    return 32768;
  }
  else if (model === 'gpt-3.5-turbo' || model === 'gpt-3.5-turbo-0301') {
    return 4096;
  }
  else if (model === 'code-davinci-002') {
    return 80001;
  }
  else {
    return null;
  }
}

export { parseToRightType, getModelMaxTokens }
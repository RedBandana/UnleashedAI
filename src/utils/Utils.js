function formatText(text) {
  // const codeRegex = /```([\s\S]*?)```/g;
  // let text = text.replace(codeRegex, '<pre>$1</pre>');

  return text;
}

function resizeElement(elementId) {
  const element = document.getElementById(elementId);
  if (element == null) {
    return;
  }

  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
}

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

export { formatText, resizeElement, parseToRightType}

export function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

export function getHttpResponseConfig() {
  const config = {
    headers: {
      Authorization: `Bearer ${getCookie('sessionToken')}`,
    }
  }

  return config;
};

export function parseToRightType(obj, property, value) {
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

export function fixHtmlMarkdown(prism, htmlElements) {
  prism.highlightAll();
  for (let i = 0; i < htmlElements.length; i++) {
    const htmlElement = htmlElements[i];
    const preElements = htmlElement.querySelectorAll('pre');

    preElements.forEach((preElement) => {
      const codeElement = preElement.querySelector('code');

      if (codeElement) {
        if (!preElement.className.includes('language')) {
          preElement.classList.add('language-none');
        }

        // Todo: Add Copy and Language
      }
    });

    const paragraphs = htmlElement.querySelectorAll('p > code');
    paragraphs.forEach((codeElement) => {
      if (!codeElement.innerHTML.startsWith('`')) {
        codeElement.innerText = '`' + codeElement.innerText + '`';
      }
    });

    const lists = htmlElement.querySelectorAll('ol, ul');
    lists.forEach((list) => {
      list.classList.add('markdown-list');
    });
  }
}
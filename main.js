const main = async () => {
  const observer = new MutationObserver(onBodyChange);
  observer.observe(document.body, { childList: true, subtree: true });
};

const onBodyChange = async (mutations, observer) => {
  // Find the issue title
  const h1 = mutations.flatMap(m => Array.from(m.addedNodes)).find(n => n.querySelector('div#issues-page h1'));
  if (!h1) {
    return;
  }
  // Do nothing if the why-tab already exists
  const whyTabLabel = document.querySelector('label[for="rule-tab-viewer__why"]');
  if (whyTabLabel) {
    return;
  }

  // Add a why-tab if any pattern matched.
  // If more than one patterns matched, the first one wins.
  const settings = await chrome.storage.sync.get('entries');
  for (const e of settings.entries) {
    const match = h1.innerText.match(e.pattern);
    if (!match) {
      continue;
    }
    const url = e.url.replace(/\${(\w+)}/g, (_, v) => match[v]);
    createWhyTab(url);
    break;
  }
};

const createWhyTab = (url) => {
  const codeTabLabel = document.querySelector('label[for="rule-tab-viewer__code"]');
  const codeTabLi = codeTabLabel.parentElement;

  const whyTabLabel = document.createElement('label');
  whyTabLabel.className = codeTabLabel.className;
  whyTabLabel.innerText = 'Why is this a issue?';

  const whyTabLi = document.createElement('li');
  whyTabLi.className = codeTabLi.className;
  whyTabLi.tabIndex = 0;
  whyTabLi.appendChild(whyTabLabel);
  whyTabLi.addEventListener('click', () => {
    window.open(url, '_blank');
  });

  codeTabLi.insertAdjacentElement('afterend', whyTabLi);
};

window.addEventListener('load', main, false);


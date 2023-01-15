// Save settings
const save = () => {
  const entries = Array.from(document.querySelectorAll('div.entry'))
      .map(e => Object.fromEntries(Array.from(e.querySelectorAll('input'))
          .map(i => [i.name, i.value])))
      .filter(o => Object.values(o).some(v => v));   // Exclude entries without any value
  const settings = { entries };
  chrome.storage.sync.set(settings);
};

// Load settings and create settings popup
const load = async () => {
  const settings = await chrome.storage.sync.get('entries');
  let entries = settings.entries;

  // Create an empty entry for placeholder
  if (!entries || entries.length === 0) {
    entries = [{ pattern: '', url: '' }];
  }

  const mainDiv = document.querySelector('div.main');

  // Disable the delete button if there are an only one entry
  const observer = new MutationObserver(() => {
    const entries = mainDiv.querySelectorAll('div.entry');
    entries.forEach(e => {
      const button = e.querySelector('button');
      if (entries.length === 1) {
        button.setAttribute('disabled', 'true');
      } else {
        button.removeAttribute('disabled');
      }
    });
  });
  observer.observe(mainDiv, { childList: true, subtree: true });

  for (let i = 0; i < entries.length; i++) {
    const entryDiv = createEntry(entries[i]);
    mainDiv.append(entryDiv);
  }

  const footerDiv = document.querySelector('div.footer');
  const button = document.createElement('button');
  button.innerText = 'Add';
  button.onclick = () => {
    const entryDiv = createEntry({ pattern: '', url: '' });
    mainDiv.append(entryDiv);
  };
  footerDiv.append(button);
};

const createEntry = (entry) => {
  const entryDiv = document.createElement('div');
  entryDiv.className = 'entry';

  const formDiv = document.createElement('div');
  formDiv.className = 'form';
  for (const [k, v] of Object.entries(entry)) {
    const label = document.createElement('label');
    const id = generateId();
    label.setAttribute('for', `${k}-${id}`);
    label.innerText = capitalize(k);
    const input = document.createElement('input');
    input.setAttribute('id', `${k}-${id}`);
    input.setAttribute('name', k);
    input.setAttribute('value', v);
    formDiv.append(label, input);
  }
  entryDiv.append(formDiv);
  const button = document.createElement('button');
  button.innerText = 'Del';
  button.className = 'delete';
  button.onclick = () => {
    entryDiv.remove();
  };
  entryDiv.append(button);
  return entryDiv;
};

const generateId = () => {
  return (Math.random() + 1).toString(36).substring(7);
};

const capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

window.addEventListener('load', load);
window.addEventListener('blur', save);

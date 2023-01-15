const INITIAL_ENTRIES = [
  {
    pattern: 'CVE-\\d{4}-\\d{4,7}',
    url: 'https://nvd.nist.gov/vuln/detail/${0}'
  }
];

// Set initial entries on installed
chrome.runtime.onInstalled.addListener((detail) => {
  const settings = {
    entries: INITIAL_ENTRIES
  };
  chrome.storage.sync.set(settings);
});

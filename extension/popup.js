function joinCaseBattle() {
  const TARGET_CASES = ['TOXIC', 'DIABLO', 'SPARK', 'ICE BLAST', 'TEETH', 'BEAST', 'SERENITY', 'JOY', 'PROGRESS', 'KITTY', 'BOBBY'];
  const CASE_SELECTOR = 'p.max-w-full.px-1.overflow-hidden';
  const PRICE_SELECTOR = 'div.flex.items-center.justify-center.rounded-tl-lg';
  const BUTTON_SELECTOR = 'a.button.mr-5';
  const JOIN_BUTTON_SELECTOR = 'button.h-12.button-green-dimmed';
  const JOIN_DELAY = 100;
  const RANDOM_DELAY = 1.2;

  (async () => {
    while (true) {
      await new Promise(r => setTimeout(r, JOIN_DELAY));
      try {
        const caseNames = [...document.querySelectorAll(CASE_SELECTOR)]
          .slice(0, 3)
          .map(e => e.textContent);
        const casePrices = [...document.querySelectorAll(PRICE_SELECTOR)]
          .slice(0, 3)
          .map(e => e.textContent);
        const targetIndex = caseNames.findIndex(name => TARGET_CASES.includes(name));
        if (targetIndex !== -1 && casePrices[targetIndex] === 'FREE') {
          const btns = [...document.querySelectorAll(BUTTON_SELECTOR)];
          const btn = btns[targetIndex];
          btn.click();
          while (true) {
            await new Promise(r => setTimeout(r, JOIN_DELAY * (Math.random() + RANDOM_DELAY)));
            try {
              const joinBtn = document.querySelector(JOIN_BUTTON_SELECTOR);
              if (joinBtn) {
                joinBtn.click();
                break;
              }
            } catch { null; }
          }
        }
      } catch { null; }
    }
  })();
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('join-button').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: joinCaseBattle,
        });
      } else {
        console.error('No active tab found.');
      }
    });
  });
});

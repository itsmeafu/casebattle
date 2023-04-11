function joinCaseBattle() {
  const TARGETS = [
    'TOXIC', 'DIABLO', 'SPARK', 'ICE BLAST', 'TEETH', 'BEAST', 
    'SERENITY', 'JOY', 'PROGRESS', 'KITTY'
  ];

  const waitFor = (delay) => new Promise(resolve => setTimeout(resolve, delay));

  const openCase = async () => {
    const caseNames = [...document.querySelectorAll('p.max-w-full.px-1.overflow-hidden')]
      .splice(0, 3)
      .map(element => element.textContent);
    const casePrices = [...document.querySelectorAll('div.flex.items-center.justify-center.rounded-tl-lg')]
      .splice(0, 3)
      .map(element => element.textContent);
    
    const targetIndex = caseNames.findIndex(name => TARGETS.includes(name));
    if (targetIndex === -1 || casePrices[targetIndex] !== 'FREE') {
      return false; // Target case not found or not free
    }

    const caseButton = [...document.querySelectorAll('a.button.mr-5')][targetIndex];
    caseButton.click();

    await waitFor(500);
    return true; // Successfully opened the target case
  };

  const joinBattle = async () => {
    const joinButton = document.querySelector('button.h-12.button-green-dimmed');
    if (!joinButton) {
      return false; // Join button not found
    }

    joinButton.click();
    await waitFor(500);
    return true; // Successfully joined the battle
  };

  const joinCaseBattle = async () => {
    while (true) {
      const success = await openCase();
      if (success) {
        while (true) {
          if (await joinBattle()) {
            break; // Successfully joined the battle, stop looping
          }
        }
      }

      await waitFor(500);
    }
  };

  joinCaseBattle();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('join-button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs.length > 0) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: joinCaseBattle
        });
      } else {
        console.error('No active tab found.');
      }
    });
  });
});

(function() {
    let adBlockDetected = false;
    let modalDisplayed = false;
    
    function detectAdBlockers() {
      createBaitElement();
      
      detectAdBlockerByURL();
      
      detectAdBlockerByScript();
      
      setInterval(checkAdBlockStatus, 5000);
    }
    
    function createBaitElement() {
      const bait = document.createElement('div');
      bait.setAttribute('class', 'ad-container advertisement banner-ad adbox adsbox ad-placeholder ad-badge');
      bait.setAttribute('id', 'ad-tester');
      bait.setAttribute('style', 'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -10000px !important;');
      document.body.appendChild(bait);
      
      setTimeout(() => {
        const computedStyle = window.getComputedStyle(bait);
        if (computedStyle.display === 'none' || 
            computedStyle.visibility === 'hidden' || 
            computedStyle.opacity === '0' ||
            bait.offsetHeight === 0 ||
            bait.offsetWidth === 0) {
          adBlockDetected = true;
          blockAccess();
        }
      }, 100);
    }
    
    function detectAdBlockerByURL() {
      const testURL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      fetch(testURL, { method: 'HEAD', mode: 'no-cors' })
        .catch(() => {
          adBlockDetected = true;
          blockAccess();
        });
    }
    
    function detectAdBlockerByScript() {
      const script = document.createElement('script');
      script.src = 'https://ad.doubleclick.net/ddm/adj/small_ad.js';
      script.onerror = function() {
        adBlockDetected = true;
        blockAccess();
      };
      document.head.appendChild(script);
    }
    
    function checkAdBlockStatus() {
      const bait = document.getElementById('ad-tester');
      if (bait) {
        const computedStyle = window.getComputedStyle(bait);
        if (computedStyle.display === 'none' || bait.offsetHeight === 0) {
          adBlockDetected = true;
          blockAccess();
        }
      } else {
        createBaitElement();
      }
      
      if (adBlockDetected && !modalDisplayed) {
        blockAccess();
      }
    }
    
    function blockAccess() {
      if (modalDisplayed) return;
      
      document.body.style.overflow = 'hidden';
      
      const overlay = document.createElement('div');
      overlay.id = 'adblock-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: white;
        font-family: Arial, sans-serif;
        padding: 20px;
      `;
      
      overlay.innerHTML = `
        <h1 style="font-size: 24px; margin-bottom: 20px;">Ad Blocker Detected</h1>
        <p style="font-size: 16px; max-width: 600px; margin-bottom: 30px;">
        Please disable your ad blocker to continue using this website.
        After disabling the ad blocker, reload the page.
        </p>
        <button id="reload-page" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
        Disabled, Reload Page
        </button>
      `;
      
      document.body.appendChild(overlay);
      
      document.getElementById('reload-page').addEventListener('click', function() {
        location.reload();
      });
      
      document.addEventListener('contextmenu', preventAction, true);
      document.addEventListener('keydown', preventKeyboardShortcuts, true);
      
      modalDisplayed = true;
    }
    
    function preventAction(e) {
      if (adBlockDetected) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    
    function preventKeyboardShortcuts(e) {
      if (adBlockDetected) {
        if (e.keyCode === 123 || 
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
            (e.ctrlKey && e.keyCode === 85)) {
          e.preventDefault();
          return false;
        }
      }
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', detectAdBlockers);
    } else {
      detectAdBlockers();
    }
  })();

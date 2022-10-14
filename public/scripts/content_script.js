(async () => {
    const src = chrome.runtime.getURL("scripts/content_main.js");
    const contentScript = await import(src);
    await contentScript.main();
})();

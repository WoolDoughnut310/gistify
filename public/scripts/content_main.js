import { createGist } from "/gists.js";

// For use in multiple functions
let accessToken;

// Gets the language used by a code block
function getLanguage(codeBlock) {
    const classList = codeBlock.classList;
    for (let className of classList) {
        // .lang-{language}
        if (className.startsWith("lang-")) {
            return className.slice(5);
        }
    }
}

// Create a button that creates gist of code content
function createGistButton(element, language) {
    const container = element.parentElement;
    const content = element.textContent.trim();

    container.className = "gist-container";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "gist-button";

    const label = document.createElement("span");
    label.textContent = "Gistify";

    const iconURL = chrome.runtime.getURL("github.svg");
    const icon = document.createElement("object");
    icon.data = iconURL;
    icon.type = "image/svg+xml";
    icon.title = "GitHub icon";

    button.appendChild(label);
    button.appendChild(icon);

    button.onclick = async () => {
        // Create gist with target language
        const extension = language ? `.${language}` : "";
        const filename = crypto.randomUUID() + extension;
        const url = await createGist(accessToken, filename, content);
        await navigator.clipboard.writeText(url);

        // Status message shown
        label.textContent = "Gistified";
        return setTimeout(() => {
            label.textContent = "Gistify";
        }, 3000);
    };

    container.insertBefore(button, container.firstChild);
}

export async function main() {
    const key = "accessToken";
    accessToken = (await chrome.storage.sync.get(key))[key];
    if (!accessToken) return;

    const codeBlocks = document.querySelectorAll("pre > code");

    for (let codeBlock of codeBlocks) {
        const language = getLanguage(codeBlock);
        createGistButton(codeBlock, language);
    }
}

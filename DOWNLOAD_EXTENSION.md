# How to Install ClauseLens Chrome Extension

Since this extension is in development, you can load it manually into Chrome:

1.  **Download/Copy the files** from the `/chrome-extension` folder in this project to your computer.
    - `manifest.json`
    - `popup.html`
    - `popup.js`
    - (Optional) `icon.png` (You can use any 128x128 image)
2.  Open Chrome and go to `chrome://extensions/`.
3.  Enable **Developer mode** (toggle at the top right).
4.  Click **Load unpacked**.
5.  Select the folder containing the files you just saved.
6.  The ClauseLens icon will appear in your extensions list.

## How it works
When you click "Analyze This Site", the extension detects your current URL and redirects you to the ClauseLens Dashboard, pre-filling the analyzer for immediate results.

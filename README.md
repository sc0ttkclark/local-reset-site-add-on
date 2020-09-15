# Local Reset Site Addon

This [Local addon](https://localwp.com) gives you two new tools that help you blow your test sites up.

![Screenshot of interface within Site](screenshot.png)

Screencast example: https://share.skc.dev/Blu5wEyE

## Empty Site

This tool will empty all content (posts, comments, terms, and meta) for the site including uploaded files.

This leaves options in place and does not deactivate plugins.

## Reset Site

This tool will delete the entire site database and reinstall WordPress.

_Note: An "admin" user will be setup with the password "admin"._

## Installation

### Requirements

* [Local](https://localwp.com/) 5.x ⚡️
* yarn or npm

### Clone

Clone the repository into the following directory depending on your platform:

-   macOS: `~/Library/Application Support/Local/addons`
-   Windows: `C:\Users\username\AppData\Roaming\Local\addons`
-   Debian Linux: `~/.config/Local/addons`

### Install Add-on Dependencies

`yarn install` or `npm install`

### Add Add-on to Local

1. Clone repo directly into the add-ons folder (paths described above)
2. `yarn install` or `npm install` (install dependencies)
2. `yarn build` or `npm run build`
3. Open Local and enable add-on

## License

MIT

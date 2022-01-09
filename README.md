## gmail-to-drive

`index.ts` is a Google Apps Script for Gmail to save given attachments to Google Drive.

### Prerequisites

To get started with the development, install the following dependencies:

- [Node 16 and npm 7](https://nodejs.org)
- `clasp`: `npm install -g @google/clasp`

### Development

Get familiar with [`clasp`](https://developers.google.com/apps-script/guides/clasp).

1. Login: `clasp login`
2. Push: `clasp push --watch`
3. Run: `clasp run `
	 >**NOTE:**  Follow [official](https://github.com/google/clasp/blob/master/docs/run.md) instruction to set up your environment.

### Setup

1. Create a project on [script.google.com](https://script.google.com/), run:
	 ```bash
	 clasp create {project_name}
	 ```
2. Compile and push the code to your project:
	 ```bash
	 clasp push
	 ```
3. Modify as needed for your particular filtering rules.
4. Set up a [Trigger](https://developers.google.com/apps-script/guides/triggers/installable)  to run the script periodically.

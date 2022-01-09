// Array of file extension which you would like to extract to Drive
import Folder = GoogleAppsScript.Drive.Folder;
import GmailLabel = GoogleAppsScript.Gmail.GmailLabel;
import GDate = GoogleAppsScript.Base.Date;

const fileTypesToExtract = ['pdf'];
// Name of the parent folder in Google Drive in which files will be put
const parentFolderID = '1k6pAq98m1D4rIILkGnzpa1tk_O0uaXqQ';
// Name of the label which will be applied after processing the mail message
// It will be automatically created if it doesn't exist.
const labelName = '@indrive';
// Sub-folders names based on message month index
const monthNames = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];
const after = "01/01/2022"
const hasAllLabels = ['firma-ksiegowosc']
const recipientEmail = "szostok.mateusz@gmail.com"

function DumpFilesToDrive() {
	let query = `NOT label:@indrive AND after:${after} AND to:${recipientEmail}`;
	query += hasAllLabels.map((label) => ` AND label:${label}`)
	query += fileTypesToExtract.map((ext) => ` OR filename:${ext}`)

	Logger.log(query)
	const threads = GmailApp.search(query);
	const label = getGmailLabel_(labelName);

	threads.forEach((thread) => {
		const msgs = thread.getMessages()
		msgs.forEach((msg) => {
			const date = msg.getDate()
			const attachments = msg.getAttachments();
			const subFolderName = monthNames[date.getMonth()];
			const subFolder = createFolder_(parentFolderID, subFolderName)

			attachments.forEach((attachment) => {
				const saveFileName = normalizeFuelInvoiceName_(attachment.getName(), date)
				Logger.log('Saving file: %s to %s', saveFileName, subFolderName)
				if (!hasWantedAttachemed_(attachment)) return;

				const att = attachment.copyBlob()
				att.setName(saveFileName)
				subFolder.createFile(att);
			})
		});
		thread.addLabel(label);
	})


}

// It doesn't apply if file name doesn't contain the `Orlen` name.
// Converts:
//   From: Faktura F 63K20/0509/22 Orlen Pay
//   To: paliwo20220107.pdf
function normalizeFuelInvoiceName_(fileName: string, date: GDate): string {
	if (!fileName.includes('Orlen')) return fileName

	const simpleDate = date.getFullYear() * 10000 +
		(date.getMonth() + 1) * 100 + date.getDate();
	return `paliwo${simpleDate}.pdf`
}

function createFolder_(folderID: string, folderName: string): Folder {
	const parentFolder = DriveApp.getFolderById(folderID);
	const subFolders = parentFolder.getFolders();

	while (subFolders.hasNext()) {
		const folder = subFolders.next();
		if (folder.getName() === folderName) {
			return folder;
		}
	}
	return parentFolder.createFolder(folderName);
}

function getGmailLabel_(name): GmailLabel {
	let label = GmailApp.getUserLabelByName(name);
	if (!label) {
		label = GmailApp.createLabel(name);
	}
	return label;
}

function hasWantedAttachemed_(attachment): boolean {
	const fileName = attachment.getName();
	const extension = fileName.split(".").pop();

	return fileTypesToExtract.indexOf(extension) !== -1;
}

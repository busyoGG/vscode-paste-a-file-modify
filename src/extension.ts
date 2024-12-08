// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import * as glob from 'glob';

function cleanUpSlashes(path: string) {
	//windows problems...
	return path
		.replace(/\\/g, "/")
		.replace(/([a-z]):\//g, (_, p1) => `${p1.toUpperCase()}:/`)
		.replace(/^\//, "")
}
function config() {
	return vscode.workspace.getConfiguration('pasteAFile')
}

async function paste() {

	// 
	//find out search path
	//
	var searchPath: string | undefined =
		config().get('directory') || // take workspacefolder if config not found or dir is "" (default).
		vscode.workspace.workspaceFolders?.[0]?.uri.path;
	if (!searchPath) {
		vscode.window.showInformationMessage(
			`No directory found to paste files from.
				Open a workspacefolder or specify the 
				paste-a-file.directory setting`
		)
		return;
	}
	searchPath = cleanUpSlashes(searchPath);

	//
	//files in search path
	//
	const filePattern: string | undefined = config().get('filePattern');
	if (!filePattern) {
		vscode.window.showErrorMessage(
			`No file pattern found to search for files.
				Please specify the paste-a-file.filePattern setting`
		)
		return;
	}
	const ignoreFilePatterns: string[] = config().get('ignoreFilePatterns')!;
	console.log(searchPath)
	console.log(filePattern)
	const files = glob.globSync(
		`${searchPath}/${filePattern}`,
		{ nodir: true, ignore: ignoreFilePatterns }
	).map(f => cleanUpSlashes(f));
	if (files.length === 0) {
		vscode.window.showInformationMessage(
			`No files to paste found. 
				Search Directory is ${searchPath}
				maybe change the file glob patterns`
		);
		return;
	}

	//
	// user selects file
	//
	console.log(searchPath)
	const shortFilenameRegexp = new RegExp(`^${searchPath}/`);
	const shortNames = files.map(f => f.replace(shortFilenameRegexp, ''));
	const pickedShortName = await vscode.window.showQuickPick(shortNames);
	const file = pickedShortName ? `${searchPath}/${pickedShortName}` : null;
	// if no template file is selected, exits.
	if (!file) { return; }

	//
	// extract content and apply regex
	//
	var text = (await vscode.workspace.openTextDocument(file)).getText()

	type RegexJson = { body: string, flags?: string };
	const excludeFromFilePatterns: RegexJson[] =
		config().get('excludeFromFilePatterns') || [] as RegexJson[];
	excludeFromFilePatterns.forEach(pattern => {
		try {
			var regex = new RegExp(pattern.body, pattern.flags)
			text = text.replace(regex, '');
		} catch (e) {
			vscode.window.showErrorMessage(
				`Provided regex \nbody: ${pattern.body} \nto exclude from file doesnt work`
			)
		}
	});

	//
	// paste content
	//
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showInformationMessage(
			`First open an editor, where the file should be pasted in`
		)
		return;
	}
	editor.edit(editBuilder => {
		editBuilder.insert(editor.selection.start, text)
	})
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('paste-a-file.paste', paste);
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }

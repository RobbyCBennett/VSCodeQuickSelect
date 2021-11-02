const vscode = require('vscode');

// See example https://github.com/atom/atom/blob/master/src/selection.js
// https://code.visualstudio.com/api/references/vscode-api#TextEditor
// const {text} = activeEditor.document.lineAt(activeEditor.selection.active.line);

//
// Helper Functions
//

function positionsEqual(pos1, pos2) {
	return pos1.line == pos2.line && pos1.character == pos2.character;
}

function justCursor(sel) {
	return positionsEqual(sel.start, sel.end);
}

function word(str) {
	return true;
}

//
// Extension Commands
//

function selectWord() {
	editor = vscode.window.activeTextEditor;
	if (editor) {
		document = editor.document;
		selections = editor.selections;

		// Compute the new selections
		newSelections = [];
		for (i = 0; i < selections.length; i++) {
			selection = selections[i];

			// Select the current word
			if (justCursor(selection)) {
				wordRange = document.getWordRangeAtPosition(selection.active);
				selection = new vscode.Selection(wordRange.start, wordRange.end);
			}

			// Select the next instance of the selected word
			// TODO: Add this functionality
			else if (word(document.getText(selection))) {
				vscode.window.showInformationMessage(document.getText(selection));
			}
			
			newSelections.push(selection);
		}

		// Replace the old selections with the new selections 
		editor.selections = newSelections;

	}
	else {
		vscode.window.showInformationMessage('Select Word: no editor');
	}
}

function selectAllWords() {
	vscode.window.showInformationMessage('Select All Words');
}

//
// Basic Extension Functions
//

function activate(context) {
	// Implement activationEvents here, defined in package.json
	// activationEvents can have keyboard shortcuts, and commands show up in the command palette
	context.subscriptions.push(vscode.commands.registerCommand('atomicSelect.selectWord', selectWord));
	context.subscriptions.push(vscode.commands.registerCommand('atomicSelect.selectAllWords', selectAllWords));
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}

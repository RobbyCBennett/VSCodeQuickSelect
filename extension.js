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

			// New selection
			if (justCursor(selection)) {
				wordRange = document.getWordRangeAtPosition(selection.active);
				selection = new vscode.Selection(wordRange.start, wordRange.end);
			}

			// Select the next instance of the selected word
			// TODO: Add this functionality
			else {
				selectedText = document.getText(selection);
				vscode.window.showInformationMessage('Need to find the next instance of: ' + selectedText);
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

function moveToStartOfWord() {
	editor = vscode.window.activeTextEditor;
	if (editor) {
		document = editor.document;
		selections = editor.selections;

		// Compute the new selections
		newSelections = [];
		for (i = 0; i < selections.length; i++) {
			selection = selections[i];

			// New selection
			if (justCursor(selection)) {
				wordRange = document.getWordRangeAtPosition(selection.active);
				selection = new vscode.Selection(wordRange.start, wordRange.start);
			}
			
			newSelections.push(selection);
		}

		// Replace the old selections with the new selections 
		editor.selections = newSelections;

	}
}

function selectToStartOfWord() {
	editor = vscode.window.activeTextEditor;
	if (editor) {
		document = editor.document;
		selections = editor.selections;

		// Compute the new selections
		newSelections = [];
		for (i = 0; i < selections.length; i++) {
			selection = selections[i];

			// New selection
			if (justCursor(selection)) {
				wordRange = document.getWordRangeAtPosition(selection.active);
				selection = new vscode.Selection(selection.active, wordRange.start);
			}
			
			newSelections.push(selection);
		}

		// Replace the old selections with the new selections 
		editor.selections = newSelections;

	}
}

function moveToEndOfWord() {
	editor = vscode.window.activeTextEditor;
	if (editor) {
		document = editor.document;
		selections = editor.selections;

		// Compute the new selections
		newSelections = [];
		for (i = 0; i < selections.length; i++) {
			selection = selections[i];

			// New selection
			if (justCursor(selection)) {
				wordRange = document.getWordRangeAtPosition(selection.active);
				selection = new vscode.Selection(wordRange.end, wordRange.end);
			}
			
			newSelections.push(selection);
		}

		// Replace the old selections with the new selections 
		editor.selections = newSelections;

	}
}

function selectToEndOfWord() {
	editor = vscode.window.activeTextEditor;
	if (editor) {
		document = editor.document;
		selections = editor.selections;

		// Compute the new selections
		newSelections = [];
		for (i = 0; i < selections.length; i++) {
			selection = selections[i];

			// New selection
			if (justCursor(selection)) {
				wordRange = document.getWordRangeAtPosition(selection.active);
				selection = new vscode.Selection(selection.active, wordRange.end);
			}
			
			newSelections.push(selection);
		}

		// Replace the old selections with the new selections 
		editor.selections = newSelections;

	}
}

//
// Basic Extension Functions
//

function activate(context) {
	// Implement activationEvents here, defined in package.json
	// activationEvents can have keyboard shortcuts, and commands show up in the command palette
	context.subscriptions.push(vscode.commands.registerCommand('atomicSelect.selectWord', selectWord));
	context.subscriptions.push(vscode.commands.registerCommand('atomicSelect.selectAllWords', selectAllWords));
	context.subscriptions.push(vscode.commands.registerCommand('atomicSelect.moveToStartOfWord', moveToStartOfWord));
	context.subscriptions.push(vscode.commands.registerCommand('atomicSelect.selectToStartOfWord', selectToStartOfWord));
	context.subscriptions.push(vscode.commands.registerCommand('atomicSelect.moveToEndOfWord', moveToEndOfWord));
	context.subscriptions.push(vscode.commands.registerCommand('atomicSelect.selectToEndOfWord', selectToEndOfWord));
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}

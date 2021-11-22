const vscode = require('vscode');

//
// Helper Functions
//


// TODO: This should go to the end of the line when going up
function previous(position) {
	if (position.line > 0 && position.character == 0) {
		return new vscode.Position(position.line - 1, position.character);
	}
	else if (position.character > 0) {
		return new vscode.Position(position.line, position.character - 1);
	}
	else {
		return null;
	}
}

function changeSelection(startWithWordRange, attribute1, attribute2) {
	editor = vscode.window.activeTextEditor;
	if (editor) {
		document = editor.document;
		selections = editor.selections;

		// Compute the new selections
		newSelections = [];
		for (i = 0; i < selections.length; i++) {
			selection = selections[i];

			// New selection
			if (selection.isEmpty) {
				wordRange = document.getWordRangeAtPosition(selection.active);

				if (wordRange) {
					if (startWithWordRange) {
						selection = new vscode.Selection(wordRange[attribute1], wordRange[attribute2]);
					} else {
						selection = new vscode.Selection(selection[attribute1], wordRange[attribute2]);
					}
				}

				// Skip to the next/previous word
				else {
					position = selection.active;
					while (! wordRange) {
						position = position;
						wordRange = document.getWordRangeAtPosition(position);
					}

					word = document.getText(wordRange);
					vscode.window.showInformationMessage('Need to find the next instance of: ' + word);
				}
			}
			
			newSelections.push(selection);
		}

		// Replace the old selections with the new selections 
		editor.selections = newSelections;

	}
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
			if (selection.isEmpty) {
				wordRange = document.getWordRangeAtPosition(selection.active);
				selection = new vscode.Selection(wordRange.start, wordRange.end);
			}

			// Select the next instance of the selected word
			// TODO: Add this functionality
			// addSelectionToNextFindMatch
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
	// selectHighlights
	vscode.window.showInformationMessage('Select All Words');
}

function moveToStartOfWord() {
	// // wordRange.start, wordRange.start
	// changeSelection(true, 'start', 'start');

	editor = vscode.window.activeTextEditor;
	if (editor) {
		document = editor.document;
		selections = editor.selections;

		// Compute the new selections
		newSelections = [];
		for (i = 0; i < selections.length; i++) {
			selection = selections[i];

			// New selection
			if (selection.isEmpty) {
				wordRange = document.getWordRangeAtPosition(selection.active);

				if (wordRange && ! selection.active.isEqual(wordRange.start)) {
					selection = new vscode.Selection(wordRange.start, wordRange.start);
				}

				// Skip to the next/previous word
				else {
					wordRange = null;
					position = selection.active;
					while (position && ! wordRange) {
						position = previous(position);
						if (position) {
							wordRange = document.getWordRangeAtPosition(position);
						}
					}
					
					if (wordRange && ! selection.active.isEqual(wordRange.start)) {
						selection = new vscode.Selection(wordRange.start, wordRange.start);
					}
				}
			}
			
			newSelections.push(selection);
		}

		// Replace the old selections with the new selections 
		editor.selections = newSelections;

	}
}

function selectToStartOfWord() {
	// selection.active, wordRange.start
	changeSelection(false, 'active', 'start');
}

function moveToEndOfWord() {
	// wordRange.end, wordRange.end
	changeSelection(true, 'end', 'end');
}

function selectToEndOfWord() {
	changeSelection(false, 'active', 'end');
	// selection.active, wordRange.end
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

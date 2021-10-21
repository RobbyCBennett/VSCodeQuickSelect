const vscode = require('vscode');

// See example https://github.com/atom/atom/blob/master/src/selection.js
// https://code.visualstudio.com/api/references/vscode-api#TextEditor
// const {text} = activeEditor.document.lineAt(activeEditor.selection.active.line);

//
// Helper Functions
//



//
// Extension Commands
//

function selectWord() {
	editor = vscode.window.activeTextEditor;
	if (editor) {		
		// document = editor.document;
		// text = document.lineAt(editor.selection.active.line).text;
		// position = document.positionAt(3);
		// word = document.getWordRangeAtPosition(position)
		// vscode.window.showInformationMessage('Select Word: ' + position);
		// vscode.window.showInformationMessage('Select Word: ' + word);
		// console.log(position);
		// console.log(word);

		wordRange = editor.document.getWordRangeAtPosition(editor.selection.active);

		// new Selection(wordRange.start, wordRange.end);

		// editor.edit((edit) => {
		// 	editor.selection = new Selection(nextCursor, nextCursor);
		// }, {
		// 	undoStopAfter: false,
		// 	undoStopBefore: false
		// });

		// editor.selection = new Selection(wordRange.start, wordRange.end);

		start = wordRange.start;
		startLine = start.line;
		startCharacter = start.character;
		end = wordRange.end;
		endLine = end.line;
		endCharacter = end.character;
		// editor.selection = new Selection(new Position(startLine, startCharacter), newPosition(endLine, endCharacter));
		// editor.selections = [new Selection(new Position(startLine, startCharacter), newPosition(endLine, endCharacter))];
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

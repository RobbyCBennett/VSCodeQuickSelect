const vscode = require('vscode');

// See example https://github.com/atom/atom/blob/master/src/selection.js

//
// Helper Functions
//



//
// Extension Commands
//

function selectWord() {
	vscode.window.showInformationMessage('Select Word');
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

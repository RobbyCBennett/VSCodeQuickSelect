const vscode = require('vscode');

//
// Helper Functions
//

const quote = /'|"|`/;

function isQuote(text, i) {
	// Not quote if character is wrong
	if (!quote.test(text[i]))
		return false;

	// Not quote if escaped with \
	if (i >= 2) {
		if (text[i-1] == '\\' && text[i-2] != '\\')
			return false;
	}
	else if (i == 1) {
		if (text[i-1] == '\\')
			return false;
	}

	return true;
}

function changeCursor(start, end, select) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return;

	const document = editor.document;
	const selections = editor.selections;
	const newSelections = [];
	const text = document.getText();
	const lastIndex = text.length - 1;

	// For each selection, expand out to the quotes
	for (const selection of selections) {
		// Travel left & right until quotes are found
		let l = document.offsetAt(selection.start);
		let r = document.offsetAt(selection.end) - 1;
		let ls, ld, lb, rs, rd, rb; // First instance of single, double, backtick
		let ln, rn = false; // New line seen
		let lFinal, rFinal;
		while (true) {
			// Move left or right
			let movedEither = false;
			if (l > 0) {
				l--;
				movedEither = true;
			}
			if (r < lastIndex) {
				r++;
				movedEither = true;
			}
			if (! movedEither)
				break;

			// Mark new lines seen
			if (text[l] == '\n')
				ln = true;
			if (text[r] == '\n')
				rn = true;

			// Left new line or quote
			if (text[l] == '\n')
				ln = true;
			else if (isQuote(text, l)) {
				switch (text[l]) {
					case "'":
						if (ls == undefined && !ln)
							ls = l;
						break;

					case '"':
						if (ld == undefined && !ln)
							ld = l;
						break;

					case '`':
						if (lb == undefined)
							lb = l;
						break;
				}
			}

			// Right new line or quote
			if (text[r] == '\n')
				rn = true;
			else if (isQuote(text, r)) {
				switch (text[r]) {
					case "'":
						if (rs == undefined && !rn)
							rs = r;
						break;

					case '"':
						if (rd == undefined && !rn)
							rd = r;
						break;

					case '`':
						if (rb == undefined)
							rb = r;
						break;
				}
			}

			// Stop if a pair of quotes are found
			if (ls != undefined && rs != undefined) {
				console.log(`SINGLE QUOTES: ${ls} ${rs}`);
				lFinal = ls;
				rFinal = rs;
				break;
			}
			else if (ld != undefined && rd != undefined) {
				console.log(`DOUBLE QUOTES: ${ld} ${rd}`);
				lFinal = ld;
				rFinal = rd;
				break;
			}
			else if (lb != undefined && rb != undefined) {
				console.log(`DOUBLE QUOTES: ${lb} ${rb}`);
				lFinal = lb;
				rFinal = rb;
				break;
			}
		}

		// Make new selection
		if (lFinal != undefined && rFinal != undefined)
			newSelections.push(new vscode.Selection(document.positionAt(lFinal+1), document.positionAt(rFinal)));
	}

	editor.selections = newSelections;
}

//
// Extension Commands
//

function cursorQuoteSelect() {
	const start  = true;
	const end    = true;
	const select = true;
	changeCursor(start, end, select);
}

function cursorQuoteStart() {
	const start  = true;
	const end    = false;
	const select = false;
	changeCursor(start, end, select);
}

function cursorQuoteStartSelect() {
	const start  = true;
	const end    = false;
	const select = true;
	changeCursor(start, end, select);
}

function cursorQuoteEnd() {
	const start  = false;
	const end    = true;
	const select = false;
	changeCursor(start, end, select);
}

function cursorQuoteEndSelect() {
	const start  = false;
	const end    = true;
	const select = true;
	changeCursor(start, end, select);
}

//
// Basic Extension Functions
//

function activate(context) {
	// Implement activationEvents here, defined in package.json
	// activationEvents can have keyboard shortcuts, and commands show up in the command palette
	context.subscriptions.push(vscode.commands.registerCommand('atomicSelect.cursorQuoteSelect', cursorQuoteSelect));
	context.subscriptions.push(vscode.commands.registerCommand('atomicSelect.cursorQuoteStart', cursorQuoteStart));
	context.subscriptions.push(vscode.commands.registerCommand('atomicSelect.cursorQuoteStartSelect', cursorQuoteStartSelect));
	context.subscriptions.push(vscode.commands.registerCommand('atomicSelect.cursorQuoteEnd', cursorQuoteEnd));
	context.subscriptions.push(vscode.commands.registerCommand('atomicSelect.cursorQuoteEndSelect', cursorQuoteEndSelect));
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}

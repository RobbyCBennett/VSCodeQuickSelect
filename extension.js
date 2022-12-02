const vscode = require('vscode');

//
// Helper Functions
//

const quote = /['"]/;
const quoteOrBacktick = /['"`]/;

function isTripleQuote(text, i, lastIndex=undefined) {
	// Not quote if character is wrong
	if (!quote.test(text[i]))
		return false;

	// Left
	if (lastIndex == undefined) {
		// Not quote if characters adjacent are missing
		if (i < 2)
			return false;

		// Not quote if characters adjacent are different
		if (text[i-1] != text[i] || text[i-2] != text[i])
			return false;

		// Not quote if escaped by \
		if (i >= 3 && text[i-3] == '\\')
			return false;
	}
	// Right
	else {
		// Not quote if characters adjacent are missing
		if (i >= lastIndex - 2)
			return false;

		// Not quote if characters adjacent are different
		if (text[i+1] != text[i] || text[i+2] != text[i])
			return false;

		// Not quote if escaped by \
		if (i > 0 && text[i-1] == '\\')
			return false;
	}

	return true;
}

function isQuoteOrBacktick(text, i) {
	// Not quote if character is wrong
	if (!quoteOrBacktick.test(text[i]))
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
		// First instance of single, double, backtick, triple single, and triple double
		let lSingle, rSingle;
		let lDouble, rDouble;
		let lBacktick, rBacktick;
		let lTripleSingle, rTripleSingle;
		let lTripleDouble, rTripleDouble;

		// Newline seen
		let lNewline, rNewline = false;

		// Final left & right positions if in a string
		let lFinal, rFinal;

		// Travel left & right until quotes are found
		let l = document.offsetAt(selection.start);
		let r = document.offsetAt(selection.end) - 1;
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

			// Left newline, triple quote, or quote
			if (text[l] == '\n')
				lNewline = true;
			else if (isTripleQuote(text, l)) {
				switch (text[l]) {
					case "'":
						if (lTripleSingle == undefined)
							lTripleSingle = l;
						break;
					case '"':
						if (lTripleDouble == undefined)
							lTripleDouble = l;
						break;
				}
			}
			else if (isQuoteOrBacktick(text, l)) {
				switch (text[l]) {
					case "'":
						if (lSingle == undefined && !lNewline)
							lSingle = l;
						break;
					case '"':
						if (lDouble == undefined && !lNewline)
							lDouble = l;
						break;
					case '`':
						if (lBacktick == undefined)
							lBacktick = l;
						break;
				}
			}

			// Right newline, triple quote, or quote
			if (text[r] == '\n')
				rNewline = true;
			else if (isTripleQuote(text, r, lastIndex)) {
				switch (text[r]) {
					case "'":
						if (rTripleSingle == undefined)
							rTripleSingle = r;
						break;
					case '"':
						if (rTripleDouble == undefined)
							rTripleDouble = r;
						break;
				}
			}
			else if (isQuoteOrBacktick(text, r)) {
				switch (text[r]) {
					case "'":
						if (rSingle == undefined && !rNewline)
							rSingle = r;
						break;
					case '"':
						if (rDouble == undefined && !rNewline)
							rDouble = r;
						break;
					case '`':
						if (rBacktick == undefined)
							rBacktick = r;
						break;
				}
			}

			// Stop if a pair of quotes are found
			if (lSingle != undefined && rSingle != undefined) {
				lFinal = lSingle;
				rFinal = rSingle;
				break;
			}
			else if (lDouble != undefined && rDouble != undefined) {
				lFinal = lDouble;
				rFinal = rDouble;
				break;
			}
			else if (lBacktick != undefined && rBacktick != undefined) {
				lFinal = lBacktick;
				rFinal = rBacktick;
				break;
			}
			else if (lTripleSingle != undefined && rTripleSingle != undefined) {
				lFinal = lTripleSingle;
				rFinal = rTripleSingle;
				break;
			}
			else if (lTripleDouble != undefined && rTripleDouble != undefined) {
				lFinal = lTripleDouble;
				rFinal = rTripleDouble;
				break;
			}
		}

		// If a quote wasn't found, end
		if (lFinal == undefined || rFinal == undefined)
			return;

		// Keep the left inside of the string
		lFinal += 1;
		// Move left if start is true
		lFinal = start ? document.positionAt(lFinal) : selection.start;
		// Move right if end is true
		rFinal = end ? document.positionAt(rFinal) : selection.end;
		// If not selecting, move the middle position to the start/end
		if (!select) {
			if (start)
				rFinal = lFinal;
			else
				lFinal = rFinal;
		}

		// Make new selection
		newSelections.push(new vscode.Selection(lFinal, rFinal));
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

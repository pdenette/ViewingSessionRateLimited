"use strict";

import * as async from "async";
import * as fs from "fs";
import * as path from "path";
import * as requestDebug from "request-debug";
import * as requestJs from "request";
import * as uuid from "uuid";

// if (process.env.NODE_ENV !== "production") {
// 	requestDebug(requestJs);
// }

const viewingSessionCreators = "http://philswin2016:3000/ViewingSession";
// const apiKey = "wCkh-9AsTgk2LFkclnAYJiHfr1nLLDmBAJXpKwGaxXV8s14u7qm5SANpLcy6QZx4";

function enumerateFiles() {
	let files = [];

	fs.readdirSync(path.join(__dirname, "..", "documents")).forEach(function(file) {
		files.push(path.join(__dirname, "..", "documents", file));
	});

	return files;
}

function createViewingSession(file, callback) {

	let displayName = file.split("\\").pop().split("/").pop();

	console.log("Creating a Viewing Session from " + file + "...");

	requestJs.post({
		"url": viewingSessionCreators,
		"headers": {
			"Content-Type": "application/json",
			// "acs-api-key": apiKey
		},
		"json": {
			"source": {
				"type": "upload",
				"displayName": displayName
			},
		}
	}, function(error, httpResponse, body) {
		let fileId = body["viewingSessionId"];
		console.log("ViewingSessionID" + fileId);
	});
}

(function main() {
	let files = enumerateFiles();

	async.forEachLimit(files, 10, createViewingSession, function(error) {
		console.log(error || "Done!");
	});
})();

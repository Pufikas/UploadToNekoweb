const JSZip = require("jszip");

const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const { APIKEY, DOMAIN, USERNAME, DIRECTORY } = process.env;
const url = "https://nekoweb.org/api/files/upload";

async function zipDirectory(inputDir, outputZipPath) {
	const zip = new JSZip();
	const rootDir = path.basename(inputDir);

	async function addFiles(dir, zipDir) {
	const entries = await fsp.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
			const full = path.join(dir, entry.name);
			const zipPath = path.join(zipDir, entry.name);

			if (entry.isDirectory()) {
				await addFiles(full, zipPath);
			} else {
				zip.file(zipPath, await fsp.readFile(full));
			}
		}
	}

		await addFiles(inputDir, rootDir);
		const buf = await zip.generateAsync({ type: "nodebuffer" });
		await fsp.writeFile(outputZipPath, buf);
	}

(async () => {
	const inputDir = path.join(process.cwd(), DIRECTORY);
	const zipPath = path.join(__dirname, "deploy.zip");

	await zipDirectory(inputDir, zipPath);


	const form = new FormData();

	form.append("pathname", "/");

	form.append(
		"files",
		new Blob([fs.readFileSync(zipPath)], { type: "application/zip" }),
		"deploy.zip"
	);

	const res = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: APIKEY
		},
		body: form
	});

	console.log("zip size: ", fs.statSync(zipPath).size);
	console.log("res: ", res.status);
	console.log(await res.text());

})();

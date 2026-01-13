const JSZip = require("jszip");

const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const { APIKEY, DOMAIN, USERNAME, DIRECTORY } = process.env;
const url = "https://nekoweb.org/api/files/upload";

async function zipDirectory(inputDir, outputZipPath) {
	const zip = new JSZip();
	const rootDir = path.basename(DOMAIN);

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
	const inputDir = path.join(process.env.GITHUB_WORKSPACE, DIRECTORY);
	const zipPath = path.join(__dirname, "deploy.zip");

	console.log("inputDir: ", inputDir);
	console.log("zipPath: ", zipPath);

	console.log("github_workspace:", process.env.GITHUB_WORKSPACE);
	console.log("cwd:", process.cwd());


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
	
	console.log("zip size: ", (fs.statSync(zipPath).size / 1024 / 1024).toFixed(2), " MB");
	console.log("res: ", res.status);
	console.log(await res.text());

})();

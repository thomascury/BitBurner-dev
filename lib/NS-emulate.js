import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync, rmdirSync } from "node:fs"
import { dirname } from "node:path"
class DownloadError extends Error {}
class NotImplementedError extends Error {}

export class NS {
    constructor(args) {
        this.description = 'Emulates Bitburner NS interface to test code locally';
        this.args = args
    }

    //args() {
    //    return process.argv.slice(2);
    //}

    tprint() {
        console.log(...arguments);
    }

    read(file_path) {
        // In NS emulated mode, we don't want to pollute the repo, so we download everything in a 'home' dir
        file_path = 'home/'.concat(file_path);
        return readFileSync(file_path, "utf8");
    }

    write(file_path, content, mode = 'w') {
        // In NS emulated mode, we don't want to pollute the repo, so we download everything in a 'home' dir
        file_path = 'home/'.concat(file_path);
        if ( mode === 'w' ) {
            // To replicate NS behaviour, we create the folder tree as we write the file
            //const folder_name = file_path.split("/").splice(0, 1).join("/");
            const folder_name = dirname(file_path)
            if (!existsSync(folder_name)) {
                mkdirSync(folder_name, { recursive: true });
            }
            writeFileSync(file_path, content, {flag: 'w+'});
        }
        else { throw new NotImplementedError(`Mode '${mode}' not implemented.`); }
        return true;
    }

    rm(file_path) {
        // In NS emulated mode, we don't want to pollute the repo, so we download everything in a 'home' dir
        file_path = 'home/'.concat(file_path);
        unlinkSync(file_path);
        // To replicate NS behaviour, we delete the folder tree as we delete the file
        let folder_name = dirname(file_path);
        while (folder_name.includes('home')) { // Do not go higher than home
            try{
                rmdirSync(folder_name)
            } catch (err) {
                if (err.code === 'ENOTEMPTY') {
                    break; // Folder is not empty, just ignore the error and break the loop
                } else { throw err; } // Otherwise throw the Error and exit function
            }
            folder_name = dirname(folder_name); // Go a level higher
        }
        return true
    }

    async wget(url, file_path) {
        const response = await fetch(url);
        if (!response.ok) { throw new DownloadError(`Unable to download the file (${response.status})`); }
        const result = await response.text();
        this.write(file_path, result);
        return true;
    }
}
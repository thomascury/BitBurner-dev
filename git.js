// Define Error catching behaviour
// true:    on catch, throw Error
// false:   on catch, print the error and return
const HARD_FAIL_ASSERTS = false

// Define defaults for script arguments
// More details on argument position evaluation is available in function parsePositionalArgs(args)
const DEFAULTS = {
    'min_pos_args_length': 2,   // Minimum 2 positional args (action, github url)
    'action': null,             // Force user selection, positional argument #1
    'owner': null,              // Force user selection, positional argument #2
    'repo': null,               // Force user selection, positional argument #3
                                // OR both inferred from github_repo_url, positional argument #2
    'tree_sha': 'main',         // Default to most up-to-date commit, positional argument #3/4
}
// Set list of allowed values for set argument
const ALLOWED_ARG_VALUES = {
    'action': ['clone', 'unclone'],
}
// Validation checker for argument
const VALIDATE_ARG = {
    'min_pos_args_length': length => length >= DEFAULTS.min_pos_args_length,
    'action': action => ALLOWED_ARG_VALUES.action.includes(action),
    'owner': owner => owner !== DEFAULTS.owner && encodeURI(owner) === owner,
    'repo': repo => repo !== DEFAULTS.repo && encodeURI(repo) === repo,
    'tree_sha': tree_sha => encodeURI(tree_sha) === tree_sha,
    'tree_url': tree_url => { try { return Boolean(new URL(tree_url)) } catch (_) { return false }
    },
}

// Padding functions for numbers display
// Source: https://stackoverflow.com/a/10074468
String.prototype.padZero= function(len, c){
    var s= '', c= c || '0', len= (len || 2)-this.length;
    while(s.length<len) s+= c;
    return s+this;
}
Number.prototype.padZero= function(len, c){
    return String(this).padZero(len,c);
}

/** @param {NS} ns */
export async function main(ns) {

    // Print usage to console, called in case of argument error
    function usage() {
        ns.tprint(
            'Usage:\n',
            `  run git.js clone (<GitHub repo URL> | <owner> <repo>) [<tree_sha or branch_name>]     Clone GitHub repo in current directory\n`,
            `  run git.js unclone (<GitHub repo URL> | <owner> <repo>) [<tree_sha or branch_name>]   Remove local files previously cloned from GitHub repo\n`,
        )
    }

    // assert implementation, Error throwing defined by const HARD_FAIL_ASSERTS
    function assert(condition, message, callBackBeforeThrow) {
        if (!condition) {
            if (HARD_FAIL_ASSERTS) {
                if (callBackBeforeThrow) { callBackBeforeThrow() }
                throw new Error(message || "Assertion failed")
            } else {
                ns.tprint(message || "Assertion failed")
                if (callBackBeforeThrow) { callBackBeforeThrow() }
                return false
            }
        }
        return true
    }

    // Parse positional arguments
    function parsePositionalArgs(args) {
        if (!assert(VALIDATE_ARG.min_pos_args_length(args.length), 'Missing arguments.', usage)) {return}

        // args[0] is mandatory argument <action>, that should be included in ALLOWED_ARG_VALUES.action
        let ACTION = args[0]
        if (!assert(VALIDATE_ARG.action(ACTION), `Wrong action '${ACTION}', should one of [${ALLOWED_ARG_VALUES.action}]`, usage)) {return}

        // Set initial values to simplify missing argument check at the end of the parser
        let OWNER = DEFAULTS.owner
        let REPO = DEFAULTS.repo
        let TREE_SHA = DEFAULTS.tree_sha
        if (args[1].startsWith('https://github.com/')) {
            // Repo URL mode, so positional args should be
            //   args[1] = <GitHub repo URL>
            //   args[2] = <tree_sha or branch_name> (optional)
            const arg0 = args[1].split('/')
            OWNER = arg0[3]
            REPO = arg0[4]
            if (REPO.endsWith('.git')) { REPO = REPO.slice(0, REPO.length - 4) }
            if (args.length > 2) { TREE_SHA = args[2] }
        } else {
            // Separate owner + repo args mode, so positional args should be
            //   args[1] = <owner>
            //   args[2] = <repo>
            //   args[3] = <tree_sha or branch_name> (optional)
            OWNER = args[1]
            REPO = args[2]
            if (args.length > 3) { TREE_SHA = args[3] }
        }

        // Checking argument before returning values
        if (!assert(VALIDATE_ARG.owner(OWNER), `Missing or invalid argument <owner>: '${OWNER}'`, usage)) {return}
        if (!assert(VALIDATE_ARG.repo(REPO), `Missing or invalid argument <repo>: '${REPO}'`, usage)) {return}
        if (!assert(VALIDATE_ARG.tree_sha(TREE_SHA), `Missing or invalid argument <tree_sha>: '${TREE_SHA}'`, usage)) {return}
        return [ACTION, OWNER, REPO, TREE_SHA]
    }

    // Evaluate arguments
    const positionalArgs = parsePositionalArgs(ns.args)
    if (positionalArgs === undefined) { return }    // Soft fail (parsePositionalArgs returns nothing on assert fail)
    const [ACTION, OWNER, REPO, TREE_SHA] = positionalArgs
    const tree_url = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${TREE_SHA}?recursive=1`
    const tree_json_file = `${OWNER}_${REPO}_${TREE_SHA}.tree.json`

    // Check if tree_url is a valid URL
    if (!assert(VALIDATE_ARG.tree_url(tree_url), `Tree URL is not valid, please check your parameters: '${tree_url}'`)) {return}

    let response_data = null
    try{
        // Retrieve tree json description from tree_url and write it to tree_json_file
        const success = await ns.wget(tree_url, tree_json_file)
        if (success) {
            ns.tprint(`Found repository https://github.com/${OWNER}/${REPO}.git`)
            const content = ns.read(tree_json_file)
            response_data = JSON.parse(content)
            ns.tprint(`Repository tree parsed`)
            // Once the tree is parsed to JSON data, we can delete the file
            ns.rm(tree_json_file)
        } else {
            ns.tprint(`Unable to retrieve repository tree ${tree_url}`)
            ns.tprint(`Please check the repository you selected is Public and correctly spelled.`)
            return
        }
    } catch (err) { ns.tprint(`${err}`); return } // Generic Error catcher in case we missed an Error

    // Supplementary check before proceeding
    if (!assert(response_data !== null, 'Error parsing tree JSON file')) { return }

    // Iterate over the tree JSON data to generate a files Map
    //      files = [
    //          {
    //              'file_path': "folder/structure/to/file/in/repo/file.ext" // Will be reused as target
    //              'url' : "Remote repo raw file URL",
    //          },
    //          {...},
    //      ]
    let files = []
    for (const tree of response_data.tree) {
        if (tree.type === 'blob' && tree.path.endsWith('.js')) {
            files.push({
                    'file_path': tree.path,
                    'url' : `https://raw.githubusercontent.com/${OWNER}/${REPO}/refs/heads/${TREE_SHA}/${tree.path}`,
                }
            )
        }
    }

    // Wrapper Promise to report status after the download has been performed
    function download_promise_wrapper (url, file_path) {
        return new Promise(async (resolve, reject) => {
            try {
                const success = await ns.wget(url, file_path)
                if (success) {
                    resolve(`✓ ${file_path} - Download successful`)
                } else {
                    reject(`✗ ${file_path} - Failed to download file`)
                }
            } catch (err) {
                reject(`✗ ${file_path} - Failed to download file (${err})`)
            }
        })
    }

    ns.tprint('')
    // Visual counters for user to know progress
    const files_total = files.length
    let file_count = 0
    let files_prepared = 0
    let preparation_failures = 0
    // ACTION defines what the user wants to do
    switch (ACTION) {
        case 'clone':
            // User wants to clone repo
            ns.tprint('Downloading files:')
            let promises = []
            for (const file of files) {
                file_count++
                try {
                    // Prepare downloads
                    promises.push(download_promise_wrapper(file.url, file.file_path))
                    files_prepared++
                } catch (err) {
                    ns.tprint(` ✗ ${file.file_path} - File could not be prepared for download (${err})`)
                    preparation_failures++
                }
            }

            //Report on preparation status
            let optional_error_comment = ''
            if (preparation_failures > 0) { optional_error_comment = ` (${preparation_failures} preparation failures)` }
            ns.tprint(`${files_prepared}/${files_total} files prepared for download${optional_error_comment}`)

            // Perform the downloads in parallel
            const results = await Promise.allSettled(promises);

            // Report downloads status
            const results_total = results.length
            let result_count = 0
            for (const result of results) {
                result_count++
                ns.tprint(`[${result_count.padZero(3)}/${results_total.padZero(3)}] ${result.value || (result.reason) }`)
            }
            if (results.filter(result => {return result.status === 'rejected'}).length > 0) { ns.tprint(`Check console (F12) for download failure(s) reason`); }
            break;
        case 'unclone':
            // User wants to clean up his home folder
            ns.tprint('Removing files:')
            for (const file of files) {
                try {
                    file_count++
                    ns.rm(file.file_path)
                    ns.tprint(`[${file_count.padZero(3)}/${files_total.padZero(3)}] ✓ Deleted: ${file.file_path}`)
                } catch (e) {
                    ns.tprint(`[${file_count.padZero(3)}/${files_total.padZero(3)}] ✗ ${file.file_path} - Error: ${e}`)
                }
            } break;
        default:
            // Should not happen with the previous checks, but fallback is here anyway
            if (!assert(false, `Wrong action ${ACTION}`, usage)) { return } break;

    }
}

// Dynamic module importer to manage the optional import of the NS-emulate module to test script locally
// Source: https://stackoverflow.com/a/65563996
class ImportError extends Error {}
const loadModule = async (modulePath) => {
    try {
        return await import(modulePath)
    } catch (err) {
        throw new ImportError(`Unable to import module ${modulePath} (${err})`)
    }
}

try {
    // This bit is included to allow for local testing of the script, with NS-Emulate.NS replicating
    //  functions available in Bitburner NS API, namely: args, tprint, read, write, rm and wget
    const NS_Emulate = await loadModule('./lib/NS-emulate.js')
    const ns = new NS_Emulate.NS(process.argv.slice(2))
    // Call main (when run locally, we have to call it ourselves, unlike in-game)
    await main(ns)
} catch (err) {
    // Bugged: In Bitburner Terminal, we do not include the NS-Emulate module, so we expect it to throw an ImportError
    // Fix: Bitburner doesn't want to throw ImportError, instead it throws a base Error, so we change the filter
    //   to ignore Errors referring to the NS-Emulate module
    // Otherwise throw any Error encountered
    if (!err.message.includes("'./lib/NS-emulate.js'")) { throw err }
}
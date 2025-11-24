# BitBurner dev repo

### git.js
git.js is a github repo cloner script (it obtains the repository tree from the corresponding GitHub API, and then downloads the content of the repo in the current folder).
Downloads are done in parallel since commit a2462d9

How to use:
1. Download the script: in the game Terminal, paste this command:
```
wget https://raw.githubusercontent.com/thomascury/BitBurner-dev/refs/heads/master/git.js git.js
```
2. Clone any Public GitHub repo:
```
Usage:
  run git.js clone (<GitHub repo URL> | <owner> <repo>) [<tree_sha or branch_name>]     Clone GitHub repo in current directory
  run git.js unclone (<GitHub repo URL> | <owner> <repo>) [<tree_sha or branch_name>]   Remove local files previously cloned from GitHub repo
```


Nice tip: you can define an alias for the command `alias git="run git.js"`, and then use the script like the git app:
```
git clone <URL>
Found repository (...)
```

Clone example
```
run git.js clone https://github.com/MrPeanutButterz/Bitburner.git
Found repository https://github.com/MrPeanutButterz/Bitburner.git
Repository tree parsed

Downloading files:
45/45 files prepared for download
[001/045] ✓ bin/bladerunners/blade.js - Download successful
[002/045] ✓ bin/bladerunners4079/bladrunners4079.js - Download successful
[003/045] ✓ bin/corporation/bigCorp.js - Download successful
[004/045] ✓ bin/corporation/corporation.js - Download successful
[005/045] ✓ bin/corporation/smallCorp.js - Download successful
[006/045] ✓ bin/genesis/collect.js - Download successful
[007/045] ✓ bin/genesis/formula.js - Download successful
[008/045] ✓ bin/genesis/hacknet.js - Download successful
[009/045] ✓ bin/genesis/pck_grow.js - Download successful
[010/045] ✓ bin/genesis/pck_hack.js - Download successful
[011/045] ✓ bin/genesis/pck_weak.js - Download successful
[012/045] ✓ bin/genesis/servers.js - Download successful
[013/045] ✓ bin/genesis/share.js - Download successful
[014/045] ✓ bin/genesis/sharePower.js - Download successful
[015/045] ✓ bin/genesis/stockMarket.js - Download successful
[016/045] ✓ bin/hacktocracy/hashnet.js - Download successful
[017/045] ✓ bin/singularity/company.js - Download successful
[018/045] ✓ bin/singularity/core.js - Download successful
[019/045] ✓ bin/singularity/crime.js - Download successful
[020/045] ✓ bin/singularity/faction.js - Download successful
[021/045] ✓ bin/singularity/gangs.js - Download successful
[022/045] ✓ bin/singularity/gym.js - Download successful
[023/045] ✓ bin/singularity/install.js - Download successful
[024/045] ✓ bin/singularity/killBN.js - Download successful
[025/045] ✓ bin/singularity/neuroflux.js - Download successful
[026/045] ✓ bin/singularity/programs.js - Download successful
[027/045] ✓ bin/singularity/ram.js - Download successful
[028/045] ✓ bin/singularity/reputation.js - Download successful
[029/045] ✓ bin/singularity/requirement.js - Download successful
[030/045] ✓ bin/singularity/school.js - Download successful
[031/045] ✓ bin/underworld/combatGang.js - Download successful
[032/045] ✓ bin/underworld/hackGang.js - Download successful
[033/045] ✓ lib/corporation.js - Download successful
[034/045] ✓ lib/factions.js - Download successful
[035/045] ✓ lib/focus.js - Download successful
[036/045] ✓ lib/network.js - Download successful
[037/045] ✓ lib/settings.js - Download successful
[038/045] ✓ system.js - Download successful
[039/045] ✓ utils/connect.js - Download successful
[040/045] ✓ utils/interface.js - Download successful
[041/045] ✓ utils/killNet.js - Download successful
[042/045] ✓ utils/monitor.js - Download successful
[043/045] ✓ utils/netRam.js - Download successful
[044/045] ✓ utils/netRm.js - Download successful
[045/045] ✓ utils/netScp.js - Download successful

```

Unclone example
```
run git.js unclone MrPeanutButterz Bitburner
Found repository https://github.com/MrPeanutButterz/Bitburner.git
Repository tree parsed

Removing files:
[001/045] ✓ Deleted: bin/bladerunners/blade.js
[002/045] ✓ Deleted: bin/bladerunners4079/bladrunners4079.js
[003/045] ✓ Deleted: bin/corporation/bigCorp.js
[004/045] ✓ Deleted: bin/corporation/corporation.js
[005/045] ✓ Deleted: bin/corporation/smallCorp.js
[006/045] ✓ Deleted: bin/genesis/collect.js
[007/045] ✓ Deleted: bin/genesis/formula.js
[008/045] ✓ Deleted: bin/genesis/hacknet.js
[009/045] ✓ Deleted: bin/genesis/pck_grow.js
[010/045] ✓ Deleted: bin/genesis/pck_hack.js
[011/045] ✓ Deleted: bin/genesis/pck_weak.js
[012/045] ✓ Deleted: bin/genesis/servers.js
[013/045] ✓ Deleted: bin/genesis/share.js
[014/045] ✓ Deleted: bin/genesis/sharePower.js
[015/045] ✓ Deleted: bin/genesis/stockMarket.js
[016/045] ✓ Deleted: bin/hacktocracy/hashnet.js
[017/045] ✓ Deleted: bin/singularity/company.js
[018/045] ✓ Deleted: bin/singularity/core.js
[019/045] ✓ Deleted: bin/singularity/crime.js
[020/045] ✓ Deleted: bin/singularity/faction.js
[021/045] ✓ Deleted: bin/singularity/gangs.js
[022/045] ✓ Deleted: bin/singularity/gym.js
[023/045] ✓ Deleted: bin/singularity/install.js
[024/045] ✓ Deleted: bin/singularity/killBN.js
[025/045] ✓ Deleted: bin/singularity/neuroflux.js
[026/045] ✓ Deleted: bin/singularity/programs.js
[027/045] ✓ Deleted: bin/singularity/ram.js
[028/045] ✓ Deleted: bin/singularity/reputation.js
[029/045] ✓ Deleted: bin/singularity/requirement.js
[030/045] ✓ Deleted: bin/singularity/school.js
[031/045] ✓ Deleted: bin/underworld/combatGang.js
[032/045] ✓ Deleted: bin/underworld/hackGang.js
[033/045] ✓ Deleted: lib/corporation.js
[034/045] ✓ Deleted: lib/factions.js
[035/045] ✓ Deleted: lib/focus.js
[036/045] ✓ Deleted: lib/network.js
[037/045] ✓ Deleted: lib/settings.js
[038/045] ✓ Deleted: system.js
[039/045] ✓ Deleted: utils/connect.js
[040/045] ✓ Deleted: utils/interface.js
[041/045] ✓ Deleted: utils/killNet.js
[042/045] ✓ Deleted: utils/monitor.js
[043/045] ✓ Deleted: utils/netRam.js
[044/045] ✓ Deleted: utils/netRm.js
[045/045] ✓ Deleted: utils/netScp.js

```

### lib/NS-emulate.js
This is a library to test your code locally, outside of the BitBurner Terminal.<br>
Currently implemented NS functions:
- ns.args()
- ns.tprint()
- ns.read()
- ns.write()
- ns.rm()
- ns.wget()

To use it, dynamically import the module at runtime:
```
/** @param {NS} ns */
export async function main(ns) {
    // Do stuff here
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
    //  functions available in Bitburner NS API
    const NS_Emulate = await loadModule('./lib/NS-emulate.js')
    const ns = new NS_Emulate.NS(process.argv.slice(2))
    // Call main (when run locally, we have to call it ourselves, unlike in-game)
    await main(ns)
} catch (err) {
    // In Bitburner Terminal, we do not include the NS-Emulate module, so we expect it to throw an ImportError
    // Thus, we ignore ImportError, and throw any other Error
    if (err.type !== ImportError) { throw err }
}
```

### Credits
- https://github.com/r3c0n75 for giving me the idea to clone a repo (specifically his [bitburner-update.js](https://github.com/r3c0n75/bitburner-scripts/blob/main/bitburner-update.js) file)
- https://github.com/MrPeanutButterz for the repo to clone in the examples :)

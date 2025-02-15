const core = require('@actions/core');
const github = require('@actions/github');
const childProcess = require("child_process");
const { promises: fs } = require("fs");
const { stdout } = require('process');

const execute = (command, skip_error=false) => new Promise((resolve, reject) => {
    childProcess.exec(command, (error, stdout, stderr) => {
        if ((error || stderr) && !skip_error) {
            reject(stderr);
            return;
        }
        else if (skip_error) {
            resolve(stderr);
            return;
        }

        resolve(stdout);
    });
})


const main = async() => {
    const app_name = core.getInput('app-name');
    const stamp_mode = core.getInput('stamp-mode');
    const release_candidate = core.getInput('release-candidate');
    const prerelease_name = core.getInput('prerelease-name');
    const release = core.getInput('release');

    if (!app_name) {
        core.setFailed(
            `App Name parameter must be suplied`
        );
    }

    try{
        await execute(`pip install vmn`);
    } catch (e) {
        core.setFailed(`Error executing pip install ${e}`);
    }
    await execute(`vmn init`, skip_error=true);
    await execute(`vmn init-app ${app_name}`, skip_error=true);

    try{
        let out;
        let current_version = await execute(`vmn show ${app_name}`);
        let current_release_mode = await execute(`vmn show --type ${app_name} | grep release_mode | cut -f2 -d" "`);
        
        if (stamp_mode == "")
        {
            stamp_mode = "patch";
        }

        if (prerelease_name == "") 
        {
            prerelease_name = "rc"
        }

        if (release) 
        {
            if (current_release_mode == "prerelease")
            {
                out = await execute(`vmn --debug release -v ${current_version} ${app_name}`);
            }
            else
            {
                out = "Can't make release of non-prerelease version";
            }
            
        }
        else if (release_candidate)
        {
            if (current_release_mode == "prerelease")
            {
                out = await execute(`vmn --debug stamp --pr ${prerelease_name} ${app_name}`);
            }
            else
            {
                out = await execute(`vmn --debug stamp -r ${stamp_mode} --pr ${prerelease_name} ${app_name}`);
            }
        }
        else 
        {
            out = await execute(`vmn --debug stamp -r ${stamp_mode} ${app_name}`);
        }
        
        core.info(`stamp stdout: ${out}`);
    } catch (e) {
        core.setFailed(`Error executing vmn stamp ${e}`);
    }

    try{
        out = await execute(`vmn show ${app_name}`);
        core.setOutput("verstr", out.split(/\r?\n/)[0]);
    } catch (e) {
        core.setFailed(`Error executing vmn show ${e}`);
    }    
}

main().catch(err => {
    console.error(err);
    process.exit(err.code || -1);
})

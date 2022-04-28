import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
    name: 'update',
    run: async toolbox => {
        const { print, git, filesystem, system } = toolbox;
        print.info('Updating git repository cluster...');

        // let configPath = filesystem.path(__dirname, '..', '..', 'config.json');
        // let configJson = filesystem.read(configPath, 'json');

        let cwdDir = filesystem.cwd();
        let configPath = filesystem.path(cwdDir, 'config.json');
        let configJson = filesystem.read(configPath, 'json');


        for (let repoInfo of configJson['repositories']) {
            let statusResult = git.checkStatus(repoInfo);
            if (!statusResult) {
                print.error(`${repoInfo['name']} has changes that need to be committed`);
            } else {
                git.update(repoInfo.repo); 
                if (repoInfo?.updateActions) {
                    filesystem.cwd(repoInfo.rootdirname)
                    for (let action of repoInfo["updateActions"]) {
                        if (action['type'] === 'command') {
                            let cmdArgs = action['args'].join(' ');
                            let command = `${action['command']} ${cmdArgs}`;
                            print.info(`Running command ${command}`);
                            system.run(command);
                        }
                    }
                }
            }         
        }

        filesystem.cwd('..');
    },
}

module.exports = command;
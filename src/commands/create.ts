import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
    name: 'create',
    run: async toolbox => {
        const { print, git, filesystem, parameters, system } = toolbox;
        
        if (parameters.array.length === 0) {
            print.error('\nERROR a config.json file must be specified to create a repository cluster\n');
            process.exit(1);
        }

        print.info('Generating new git repository cluster...');

        // let configPath = filesystem.path(__dirname, '..', '..', 'config.json');
        let cwdDir = filesystem.cwd();
        let configPath = filesystem.path(cwdDir, 'config.json');
        let configJson = filesystem.read(configPath, 'json');

        for (let repoInfo of configJson['repositories']) {
            git.clone(repoInfo.repo);
            if (repoInfo?.cloneActions) {
                filesystem.cwd(repoInfo.rootdirname)
                for (let action of repoInfo["cloneActions"]) {
                    if (action['type'] === 'command') {
                        let cmdArgs = action['args'].join(' ');
                        let command = `${action['command']} ${cmdArgs}`;
                        print.info(`Running command ${command}`);
                        system.run(command);
                    }
                }
                
                filesystem.cwd('..');
            }
        }
    },
}

module.exports = command;
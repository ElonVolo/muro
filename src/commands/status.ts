import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
    name: 'create',
    run: async toolbox => {
        const { print, git, filesystem } = toolbox;
        print.info('Generating new git repository cluster...');

        let configPath = filesystem.path(__dirname, '..', '..', 'config.json');
        let configJson = filesystem.read(configPath, 'json');

        for (let repoInfo of configJson['repositories']) {
            let statusResult = git.checkStatus(repoInfo);
            if (!statusResult) {
                print.error(`${repoInfo['name']} has changes that need to be committed`);
            }
        }
    },
}

module.exports = command;
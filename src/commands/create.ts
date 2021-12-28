import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
    name: 'create',
    run: async toolbox => {
        const { print, git, filesystem } = toolbox;
        print.info('Generating new git repository cluster...');

        let configPath = filesystem.path(__dirname, '..', '..', 'config.json');
        let configJson = filesystem.read(configPath, 'json');

        for (let repoInfo of configJson['repositories']) {
            git.clone(repoInfo.repo);
        }
    },
}

module.exports = command;
import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
    name: 'update',
    run: async toolbox => {
        const { print, git, filesystem } = toolbox;
        print.info('Updating git repository cluster...');

        let configPath = filesystem.path(__dirname, '..', '..', 'config.json');
        let configJson = filesystem.read(configPath, 'json');

        for (let repoInfo of configJson['repositories']) {
            git.update(repoInfo.repo);
        }
    },
}

module.exports = command;
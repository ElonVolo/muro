import simpleGit, {
    SimpleGitOptions,
    SimpleGit,
    GitError
} from 'simple-git';


module.exports = toolbox => {
    const {
        print,
        filesystem
    } = toolbox;

    toolbox.git = {
        clone: async (repoPath) => {
            print.info(`Cloning ${repoPath}...\n`);
            const git: SimpleGit = simpleGit();

            git.clone(repoPath, {}, (err:GitError, data:string) => {
                if (err) {
                    print.error(err);
                } else {
                    print.info(data);
                }
            })
        },

        update: async (repoInfo) => {
            print.info(`Updating repository ${repoInfo['name']}...`);

            let repoPath = filesystem.path(process.cwd(), repoInfo['rootdirname']);

            const basicOptions: Partial<SimpleGitOptions> = {
                baseDir: repoPath,
                binary: 'git',
                maxConcurrentProcesses: 6
            };

            const git:SimpleGit = await simpleGit(basicOptions);

            try {
                await git.pull();
            } catch (e) {
                print.error(`Repository at ${repoInfo.rootdirname} could not be updated due to an error:`);
                print.error(e);
            }
        },

        checkStatus: async (repoInfo) => {
            print.info(`Checking status on local repo ${repoInfo['name']}`);

            try {
                const git:SimpleGit = await simpleGit();
                let statusInfo = await git.status();
                let statusSituation = statusInfo.isClean();
                return statusSituation;
            } catch (e) {
                print.error('Error getting status:');
                print.error(e);
            }
        }
    }
}
const pact = require('@pact-foundation/pact-node');

if (!process.env.CI && !process.env.PUBLISH_PACT) {
    console.log("skipping Pact publish...");
    process.exit(0);
}

const pactBrokerUrl = process.env.PACT_BROKER_BASE_URL || 'https://smartbear.pactflow.io';
const pactBrokerToken = process.env.PACT_BROKER_TOKEN || 'Fa38Uk5C93v_vbYAkTjX5Q';

const gitBranch = getGitBranch(); // Function to get Git branch

const opts = {
    pactFilesOrDirs: ['./pacts/'],
    pactBroker: pactBrokerUrl,
    pactBrokerToken: pactBrokerToken,
    tags: ['prod', 'test'],
    consumerVersion: `${gitBranch}-1.0.0`
};

pact
    .publishPacts(opts)
    .then(() => {
        console.log('Pact contract publishing complete!');
        console.log('');
        console.log(`Head over to ${pactBrokerUrl}`);
        console.log('to see your published contracts.');
    })
    .catch(e => {
        console.log('Pact contract publishing failed: ', e);
    });

function getGitBranch() {
    try {
        // Attempt to get the branch name, or use 'main' as a default
        return require('child_process').execSync('git rev-parse --abbrev-ref HEAD').toString().trim() || 'main';
    } catch (error) {
        return 'main';
    }
}


/**
 * These settings allow to change the default fork behavior.
 *  
 */




const expandObject = (object) => {
    if(object === null || object === undefined) {
        console.log('settings are undefined/null.')
        return
    }

    for(let prop in object) {
        prop === undefined ? '' : console.log(`Settings: ${prop}: ${object[prop]}`)
    }
}

const init = () => {
    
    const cluster = require('cluster')

    console.log(`cluster.settings, before: ${expandObject(cluster.settings)}`)
    cluster.setupMaster({
        args: ['some', 'sample', 'arguments'],
        exec: `${__dirname}/cluster_setup_child.js`,
        stdio: [process.stdin, 'pipe', process.stderr, 'ipc']
    })
    console.log(`cluster.settings, after: ${expandObject(cluster.settings)}`)

    const worker1 = cluster.fork()
    if(worker1.process.stdout) worker1.process.stdout.on('data', data => console.log(`\nworked said: ${data}`))

}

module.exports = init
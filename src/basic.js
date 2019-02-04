/**
 * Cluster module helps create and leverage available CPU cores on a server.
 * It let's child processes(workers) in the cluster share a socket connection and port.
 * The master process listens for network connections and distribute them across the available workers/child processes in the cluster, using either:
 *  1. "Round-Robin approach" - with built in smarts to avoid overloading a worker process.
 *  2. "Opt-in approach" - where master creates the listening socket and hands it off to the interested workers.
 *    This approach may seem better between the two, but in practice mostly only few out of available worker process get most of the load.
 */


const init = () => {

    const cluster = require('cluster')
    const http = require('http')
    const numCPUs = require('os').cpus().length

    if (cluster.isMaster) {
        for (let n = 1; n <= numCPUs; n++) {
            cluster.fork()
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker: ${worker.process.pid} died.`)
        })

        //console.log(cluster.workers)
    } else {
        http.createServer((req, res) => {
            res.writeHead(200)
            res.end(`Your request was handled by worker: ${cluster.worker.id}\n`)
        }).listen(8000)

        console.log(`Worker with process id: ${process.pid} started!`)
    }
}
module.exports  = init
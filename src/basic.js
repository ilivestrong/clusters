/**
 * Cluster module helps create and leverage available CPU cores on a server.
 * It let's child processes in the cluster share a socket connection and port.
 * It manages/orchestrates the work scheduling, the incoming connections, between the available workers/child processes in the cluster.
 * The workers inside the cluster, by default, all do same work(process same code/file, but this behavior can be changed for each fork). 
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
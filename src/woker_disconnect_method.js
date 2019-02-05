const init = () => {
    const cluster = require('cluster')
    const http = require('http')

    if(cluster.isMaster) {

        /**
         * Spin up workers for all available cores/cpus and listen for 'disconnect' on cluster object.
         */
        // const worker1 =  require('os').cpus().forEach((cpu, idx, cpuInfo) => {
        //     cluster.fork()
        // }) 
        // cluster.on('disconnect', () => console.log(`Worker ${worker1.process.pid} disconnected!!!`))

        console.log(`Master spun on: ${process.pid}.`)

        const worker1 = cluster.fork()
        worker1.on('disconnect', () => {console.log(`\nWorker ${worker1.process.pid} disconnected!!!\nExitAfterDisconnected: ${worker1.exitedAfterDisconnect}, IsDead: ${worker1.isDead()}`)})
        worker1.on('exit', (code, signal) => console.log(`\nWorker ${worker1.id} exited, IsDead: ${worker1.isDead()}, Reason: ${signal || 'No Signal'}, handled on Worker.`))

        cluster.on('exit', (worker, code, signal) => console.log(`\nWorker: ${worker.id} exited, IsDead: ${worker.isDead()}, Reason: ${signal ||code}, handled on Master`))
        cluster.on('listening', (worker, address) => console.log(`\nA new worker:${worker.id} is connected at address: ${address.address || 'localhost'}:${address.port}, address type: ${address.addressType}`))

        cluster.on('online', (worker) => console.log(`\nYayy!!! Worker:${worker.id} is online now and ready to service requests.`))
    }
    else {
        console.log(`\nWorker: ${process.pid} created.`)
        console.log(`\nSpinning up a web server on Worker: ${process.pid}.`)

        // Create a web server on worker
        const server = http.Server((req, res) => {
            res.writeHead(200)
            res.end(`Your request was handled by a Node Worker process ${process.pid}.`)
        })
        .listen(8000)

        // Handle 'close' event Server spun on Worker.
        server.on('close', () => console.log(`~~~ Server on Worker: ${process.pid} closed gracefully.`))
        //cluster.worker.disconnect() // Disconnect the Worker from Cluster.
        cluster.worker.kill('SIGTERM')        
    }
}
module.exports = init
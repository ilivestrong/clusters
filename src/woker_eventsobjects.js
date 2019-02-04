
const init =() => {
    const cluster = require('cluster')
    if(cluster.isMaster) {
        const worker1 =  cluster.fork()
       
      console.log(`Master PID: ${process.pid}`)

        // Handle disconnect and error events on specific 'Worker' instance.
        worker1.on('disconnect', () => console.log(`Worker: ${worker1.process.pid} disconnected.`))
        worker1.on('error', err => console.log(`worker: ${process.pid} encountered error: ${err}`))
       
        // Handle 'message' event on cluster. This event listener will executed, if any worker forked sends message to the cluster master.
        cluster.on('message', (worker, msg, handle) => console.log(`(Message From Child): '${msg}'. Handled on Cluster object.`))

        // Handle 'message' event on specific 'Worker' object.
        worker1.on('message', msg => console.log(`(Message from Child): '${msg}'. Handled on Worker object.`))

        // Sends message to specific Worker
        worker1.send('Voila !')
       
    }
    else {
        console.log(`worker created: ${process.pid}`)
        
        // Sends message to Master 
        process.send(`I am ${process.pid}`)

        // Handles message from Master
        process.on('message', msg => console.log(`(Message from Master): ${msg}, PID: ${process.ppid}`))
       
    }
}
module.exports = init
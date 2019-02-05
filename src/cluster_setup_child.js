const cluster = require('cluster')


console.log(`\nWorker initialized with Id: ${cluster.worker.id}, Pid: ${process.pid}`)
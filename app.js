const express = require('express')
const cluster = require('cluster')
const os = require('os')

const app = express();
const numCpu = os.cpus().length

app.get('/',(req,res,next)=>{
    for (let i=0; i< 1e8; i++){
        //some lengthy task
    }
    res.send(`Pass..${process.pid}`)
    cluster.worker.kill();
})

if(cluster.isMaster){
    for(let i=0;i<numCpu;i++){
        cluster.fork()
    }
    cluster.on('exit',(worker,code,signal)=>{
        console.log(`worker ${process.pid} died`)
        cluster.fork();
    })
}
else{
    app.listen(5068, ()=>{
        console.log(`server ${process.pid} running in port 5068`)
    })
}

// app.listen(5068, ()=>{
//     console.log(`server running in port 5068`)
// })

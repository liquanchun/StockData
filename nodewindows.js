/**
 * Created by Administrator on 2015-11-13.
 */
var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name:'Hello World',
    description: 'The nodejs.org example web server.',
    script: 'E:\\WebstormProjects\\untitled\\indexls.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
    svc.start();
});

svc.install();
var Collector = require('node-netflowv9');
var MongoClient = require('mongodb').MongoClient;
var util = require('util');


var receivedCount = 0;

var writtenCount = 0;
var sources = [];


MongoClient.connect("mongodb://localhost", function(err, host){
    if(err){
        console.log('error during connect to mongo db: ', util.inspect(err, true, null))
    }

    var db = host.db("netflow");
    Collector({port: 2055}).on('data', function _flowHandler(flow) {
        //console.log(flow)
        //console.log('got header:', flow.header)
        delete flow.packet
        delete flow.templates
        db.collection('netflowRaw').insert(flow, function(err, result){
            if(err){
                console.log('error during insert: ', util.inspect(err, true, null))
            } else {
                writtenCount++
            }
        })
        // if(flow.header && flow.flows){
        //     receivedCount++;
        //     var seconds = flow.header.seconds;
        //     var rinfo = flow.rinfo.address;
        //     if(sources.indexOf(rinfo) === -1){
        //         console.log('adding: ', rinfo);
        //         sources.push(rinfo)
        //     }
        //     if(flow.header.count > 0){
        //         flow.flows.map(function(element, index, array){
        //             element.seconds = seconds;
        //             element.rinfo = rinfo;
        //             //console.log(element)
        //             db.collection('netflowRaw').insert(element, function(err, result){
        //                 if(err){
        //                     console.log('error during insert: ', util.inspect(err, true, null))
        //                 } else {
        //                     writtenCount++
        //                 }
        //             })
        //         })
        //     }
        // }

    })
});


setInterval(function(){
    console.log('Received: ', receivedCount, ' Written: ', writtenCount)
}, 60000);

setInterval(function(){
    console.log('sources: ', sources)
}, 60000 * 15);
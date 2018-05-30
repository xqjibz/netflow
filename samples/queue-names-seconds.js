var mongo = require('mongoskin')
var util = require('util')

var db = mongo.db("mongodb://localhost/netflowRaw", {safe : true})




db.collection('netflow').find({}, function(err, flowResult){
    if(err){
        console.log(err)
    }
    var previousSeconds = 0
    var currentSeconds = 0
    flowResult.each(function(err, flow){
        if(err){
            console.log('error in each, at cursor, ', util.inspect(err, true, null))
        }

        console.log(flow.seconds - (flow.seconds % 60))
    })
})


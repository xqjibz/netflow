var mongo = require('mongoskin')
var util = require('util')



var db = mongo.db("mongodb://localhost/netflowRaw", {safe : true})


var totalFlowCount = 0
var filter = {
    'sort' : [['seconds', 'asc']]
}
db.collection('netflow').find({}, function(err, flowResult){
    if(err){
        console.log(err)
    }
    flowResult.each(function (err, flow) {
        totalFlowCount++
        var minuteBoundary = flow.seconds - (flow.seconds % 60)
    })

})


var mongo = require('mongoskin')
var util = require('util')
var process = require('process')

var db = mongo.db("mongodb://localhost/netflowRaw", {safe : true})


console.log('start time: ', new Date().toString())

var startDate = new Date(1484164081 * 1000) //seconds vs milliseconds

var startTime = new Date(startDate)
var endTime = new Date(startDate)

startTime.setSeconds(0)
endTime.setSeconds(60)

var beginSeconds = startTime.valueOf() / 1000
var endSeconds = endTime.valueOf() / 1000

var query = {

        'seconds': {'$gte' : beginSeconds, '$lte' : endSeconds},
        'rinfo': '10.3.31.4'
}
var filter = {
        'sort' : [['ipv4_src_addr', 'asc'], ['ipv4_dst_addr', 'asc'], ['l4_src_port', 'asc'], ['l4_dst_port', 'asc']]
}


console.log(query)

db.collection('netflow').find(query, filter).toArray(function(err, result){

    console.log('total records in: ', result.length)

    var finalResult = []
    var totalComparisons = 0, totalMatches = 0


    result.forEach(function(element, index, array){

        var foundOne = false
        if(index === 0)
        for(var i = index ; i < result.length ; i++){
            totalComparisons++
            console.log(element, array[i])
            if(element.ipv4_src_addr === array[i].ipv4_src_addr){
                totalMatches++
            } else {
                break;
            }
            if(i === 2) process.exit(0);

        }



    })

    console.log('end time:  ', new Date().toString())
    console.log('compares: ', totalComparisons, ' matches: ', totalMatches)

})


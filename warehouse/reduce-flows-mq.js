var mongo = require('mongoskin')
var util = require('util')
var amqp = require('amqplib/callback_api')


var db = mongo.db("mongodb://localhost/netflowRaw", {safe : true})


var totalFlowCount = 0

amqp.connect('amqp://localhost', function (err, conn){
    conn.createChannel(function(err, channel){
        // var q = 'hello'
        channel.assertExchange('netflow', 'topic', {'durable':false})
        db.collection('netflow').find({}, function(err, flowResult){
            if(err){
                console.log(err)
            }
            flowResult.each(function (err, flow) {
                totalFlowCount++
                var msg = {'totalFlowCount': totalFlowCount}
                var minuteBoundary = flow.seconds - (flow.seconds % 60)

                var routingKey = 'time.' + minuteBoundary
                var queueName = 'raw-' + minuteBoundary
                //console.log(routingKey)
                var myBuffer = new Buffer(JSON.stringify(flow))
                channel.assertQueue(queueName, {'autoDelete': true}, function(err, queue) {

                    if(err){
                        console.log('error during queue assertion: ', util.inspect(err, true, null))
                    }
                    channel.bindQueue(queue.queue, 'netflow', routingKey, {}, function(err, ok){
                        if(err){
                            console.log('error during binding: ', util.inspect(err, true, null))
                        }
                        console.log("Chananel OK is: ", ok)

                    });


                    //channel.publish('netflow', routingKey, myBuffer)  //JSON.stringify(msg)

                });


            })

        })

    })


})
//
// db.collection('netflow').find({}, function(err, flowResult){
//     if(err){
//         console.log(err)
//     }
//     flowResult.each(function (err, flow) {
//         totalFlowCount++
//         var msg = {'totalFlowCount': totalFlowCount}
//         var myBuffer = new Buffer(JSON.stringify(msg))
//         //console.log(util.inspect(myBuffer, true, null))
//         //console.log(JSON.stringify(msg))
//         channel.publish('netflow', '123456key', myBuffer)  //JSON.stringify(msg)
//     })
//
// })


// db.collection('netflow').find({}, function(err, flowResult){
//     if(err){
//         console.log(err)
//     }
//     totalFlowCount++
// })

// ch.consume(queue.queue, function(msg) {
//     console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
// }, {noAck: true});

// channel.sendToQueue(queue, new Buffer('Hello world'))
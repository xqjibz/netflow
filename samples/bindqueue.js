var mongo = require('mongoskin')
var util = require('util')
var amqp = require('amqplib/callback_api')


var totalFlowCount = 0

amqp.connect('amqp://localhost', function (err, conn){
    conn.createChannel(function(err, channel){
        // var q = 'hello'
        channel.assertExchange('netflow', 'topic', {'durable':false})
        channel.assertQueue('myqueue', {'autoDelete': true}, function(err, queue) {

            if(err){
                console.log('error during queue assertion: ', util.inspect(err, true, null))
            }
            channel.bindQueue(queue.queue, 'netflow', 'time.148746533');

            });


        })

})




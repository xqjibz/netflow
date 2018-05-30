var req = require('request');

var user = "username";
var pass = "password";

var baseUrl = "http://api:api@localhost:15672/api/";
var queues = "queues?columns=name,messages,messages_ready";

req.get({
    url:baseUrl+queues,
    json:true,
},function(err,res, body){
    console.log('in call back')
    if(err){
        console.log(err)
    }
    console.log(body)
    body.forEach(function(queue){
        if(queue && queue.name){
            var url = baseUrl+"queues/%2F/"+queue.name;
            req({
                url: url,
                method:"DELETE"
            },function(errr,ress,body){
                console.log(errr,ress);
                console.log("DELETE:", url,body);
            });
        }
    });
});

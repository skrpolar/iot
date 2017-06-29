//服务器及页面响应部分
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    msg = "1";
io = require('socket.io')(server); //引入socket.io模块并绑定到服务器
app.use('/', express.static(__dirname + '/www'));

app.get('/sensor',function(req,res){
    
    // console.log(req.query.sensorNum);
    iotsql.init(req.query.sensorNum,"addSensor",res);
    // res.send(msg);

});

//socket部分
io.on('connection', (socket) => {

    socket.on('initLightStatus', (initArr) => {

        console.log("准备初始化灯");
        iotsql.init(initArr,"init",socket);

    });

    socket.on('searchLedNum', (id,str) => {
        
        console.log("服务器准备查询");
        iotsql.init(id,"add",socket,str);

    });

    socket.on('message', (str) => {

        console.log("服务器接收到了： " + str);

        if(str !== "d" && str !== "e"){

            var ledId = parseInt(str);
            iotsql.init(ledId,"refresh",socket);

        }
        

    });

});

server.listen(8989);

//---------------------------------------------------------------------------------
//服务器与网关客户端通信

var net = require('net');  
  
var chatServer = net.createServer();  

var gclient;


chatServer.on('connection', (client) => {  

    gclient = client;
    gclient.setDefaultEncoding("hex");
  
});  


chatServer.listen(9000);  


//---------------------------------------------------------------------------------
//mysql连接

var iotsql = {

    init: (num,str,socket,sensor) => {

        var mysql  = require('mysql');  
        var light_num = num;//多少盏灯

        var connection = mysql.createConnection({   

            host     : '172.16.146.169',       
            user     : 'root',              
            password : '123123',       
            port     : '3306',                   
            database : 'iotdesign', 

        }); 

        if(str == "addSensor"){
            switch(num){

                case "1" : (() => {
                    let sql = "SELECT * FROM (SELECT * FROM `sensor_data`  where number = 3 ORDER BY time desc limit 1) as t2 UNION SELECT * FROM (SELECT * FROM `sensor_data`  where number = 1 ORDER BY time desc limit 1) as t1 UNION SELECT * FROM `sensor_data`  where number = 2 ORDER BY time desc limit 3";
                    iotsql.connect(connection,sql,num,str,socket);
                })();
                break;

                case "2" : (() => {
                    let sql = "SELECT * FROM (SELECT * FROM `sensor_data`  where number = 5 ORDER BY time desc limit 1) as t2 UNION SELECT * FROM (SELECT * FROM `sensor_data`  where number = 4 ORDER BY time desc limit 1) as t1 UNION SELECT * FROM `sensor_data`  where number = 6 ORDER BY time desc limit 3";
                    iotsql.connect(connection,sql,num,str,socket);
                })();
                break;

                case "3" : (() => {
                    let sql = "SELECT * FROM (SELECT * FROM `sensor_data`  where number = 8 ORDER BY time desc limit 1) as t2 UNION SELECT * FROM (SELECT * FROM `sensor_data`  where number = 7 ORDER BY time desc limit 1) as t1 UNION SELECT * FROM `sensor_data`  where number = 9 ORDER BY time desc limit 3";
                    iotsql.connect(connection,sql,num,str,socket);
                })();
                break;

                case "4" : (() => {
                    let sql = "SELECT * FROM (SELECT * FROM `sensor_data`  where number = 11 ORDER BY time desc limit 1) as t2 UNION SELECT * FROM (SELECT * FROM `sensor_data`  where number = 10 ORDER BY time desc limit 1) as t1 UNION SELECT * FROM `sensor_data`  where number = 12 ORDER BY time desc limit 3";
                    iotsql.connect(connection,sql,num,str,socket);
                })();
                break;

            }
        }else {
            var sql = iotsql.query(light_num,str,sensor);//最终sql语句
            iotsql.connect(connection,sql,light_num,str,socket,sensor);
        }
        
    },

    query: (light_num,str,sensor) => {   

        if(str == "refresh"){
            total = "SELECT * FROM `light_control` where number =" + light_num + " ORDER BY time desc limit 1";
            return total;
        }  

        if(str == "add"){

            if(sensor == "sensor"){

                if(light_num == 1){
                    return "SELECT value FROM `sensor_data`where number = 1 ORDER BY time desc limit 1";
                }
                if(light_num == 2){
                    return "SELECT value FROM `sensor_data`where number = 2 ORDER BY time desc limit 1";
                }
                
            }else {

                if(light_num !== undefined){
                    return "SELECT * FROM `light_control` where number =" + light_num + " ORDER BY time desc limit 1";
                }else if(light_num == undefined){
                    return "SELECT number FROM `light_control` GROUP BY number;";
                }

            }

            
            
        }

        if(str == "init"){ //查询算法有bug
            var lightArrLength = light_num.length;

            if(lightArrLength == 1){
                var sql = "SELECT * FROM `light_control` where number = 1 ORDER BY time desc limit 1";
                return sql;
            }else if(lightArrLength == 2){
                var sql = "SELECT * FROM (SELECT * FROM `light_control` where number = 2 ORDER BY time desc limit 1)as t1 UNION SELECT * FROM `light_control` where number = 1  ORDER BY time desc limit 2";   
                return sql;
            }else if(lightArrLength >= 3){
                var str_3 = "SELECT * FROM (SELECT * FROM `light_control` where number =" + light_num[1] + " ORDER BY time desc limit 1)as t1 UNION SELECT * FROM `light_control` where number =" + light_num[0] + "  ORDER BY time desc limit " + lightArrLength;
                var total = "";
                for(var i = 3; i <= lightArrLength; i ++){
                total = "SELECT * FROM (SELECT * FROM `light_control` where number = " + light_num[i - 1] + " ORDER BY time desc limit 1)as t" + light_num[i - 1] + " UNION " + total;
            }
            total = total + str_3;
            // console.log(total);
            return total;
            }

        }
        
    },

    

    connect: (connection,sql,light_num,str,socket,sensor) => {

        connection.connect();

        connection.query(sql, (err, result) => {
            if(err){
              console.log('[SELECT ERROR] - ',err.message);
              return;
            }
            

            switch(str){
                
                case "init" : (() => {
                    var initArr = new Array(light_num);
                    for(var i in result){
                        initArr[i] = {
                            number: result[i].number,
                            state: result[i].state
                        }
                    };
                    socket.send(initArr,str);
                })();
                break;

                case "refresh" : (() => {

                    let changeState = 0;
                    switch(result[0].state){
                        case 0 : changeState = 1;break;
                        case 1 : changeState = 0;break;
                    }

                    gclient.write("fc00020" + result[0].number + "0" + changeState); // 服务端向客户端输出信息，使用 write() 方法  

                    setTimeout(() => {
                        
                        socket.send({
                            number: result[0].number,
                            state: (() => {
                                if(result[0].state == 1){
                                    return 0;
                                }else{
                                    return 1;
                                }
                            })()
                        },str);
                    },300);


                    socket.send({
                        number: result[0].number,
                    },"wait");
           

                })();
                break;

                case "add" : (() => {

                    if(sensor == "sensor"){
                        socket.emit('sensor',result[0].value);
                    }else {
                        socket.emit('ledNum',result);
                        
                    }

                })();
                break;

                case "addSensor" : (() => {

                    socket.send(result);

                })();
                break;

            }

        });

        connection.end();

    }
}
 
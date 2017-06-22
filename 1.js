// var mysql  = require('mysql');  
 
// var connection = mysql.createConnection({     
//   host     : '172.16.146.169',       
//   user     : 'root',              
//   password : '123123',       
//   port: '3306',                   
//   database: 'iotdesign', 
// }); 

// var light_num = 8;//多少盏灯

// function sql_f(){
//     if(light_num == 1){
//         var sql = "SELECT * FROM `light_control` where number = 1 ORDER BY time desc limit 1";
//         return sql;
//     }else if(light_num == 2){
//         var sql = "SELECT * FROM (SELECT * FROM `light_control` where number = 2 ORDER BY time desc limit 1)as t1 UNION SELECT * FROM `light_control` where number = 1  ORDER BY time desc limit 2";   
//         return sql;
//     }else if(light_num >= 3){
//         var str_3 = "SELECT * FROM (SELECT * FROM `light_control` where number = 2 ORDER BY time desc limit 1)as t1 UNION SELECT * FROM `light_control` where number = 1  ORDER BY time desc limit " + light_num;
//         var total = "";
//         for(var i = 3; i <= light_num; i ++){
//             total = "SELECT * FROM (SELECT * FROM `light_control` where number = " + i + " ORDER BY time desc limit 1)as t" + i + " UNION " + total;
//         }
//         total = total + str_3;
//         return total;
//     }
// }
// var sql = sql_f();//最终sql语句
 
// connection.connect();
 
// // var  sql = 'SELECT  FROM light_control';
// //查
// connection.query(sql,function (err, result) {
//         if(err){
//           console.log('[SELECT ERROR] - ',err.message);
//           return;
//         }
 
//        console.log(result);
//        console.log('------------------------------------------------------------\n\n');  
//        console.log(result[0].number);
// });
 
// connection.end();

// var iotsql = {

//     init: function(num) {
//         var mysql  = require('mysql');  
//         var light_num = num;//多少盏灯
//         var connection = mysql.createConnection({   

//             host     : '172.16.146.169',       
//             user     : 'root',              
//             password : '123123',       
//             port: '3306',                   
//             database: 'iotdesign', 

//         }); 
//         var sql = iotsql.query();//最终sql语句
//         iot.connect();
//     },

//     query: function() {        
//         if(light_num == 1){
//             var sql = "SELECT * FROM `light_control` where number = 1 ORDER BY time desc limit 1";
//             return sql;
//         }else if(light_num == 2){
//             var sql = "SELECT * FROM (SELECT * FROM `light_control` where number = 2 ORDER BY time desc limit 1)as t1 UNION SELECT * FROM `light_control` where number = 1  ORDER BY time desc limit 2";   
//             return sql;
//         }else if(light_num >= 3){
//             var str_3 = "SELECT * FROM (SELECT * FROM `light_control` where number = 2 ORDER BY time desc limit 1)as t1 UNION SELECT * FROM `light_control` where number = 1  ORDER BY time desc limit " + light_num;
//             var total = "";
//             for(var i = 3; i <= light_num; i ++){
//             total = "SELECT * FROM (SELECT * FROM `light_control` where number = " + i + " ORDER BY time desc limit 1)as t" + i + " UNION " + total;
//         }
//         total = total + str_3;
//         return total;
//         }
//     },

//     connect: function(){
//         iotsql.connection.connect();
//         iotsql.connection.query(sql,function (err, result) {
//         if(err){
//           console.log('[SELECT ERROR] - ',err.message);
//           return;
//         }
 
//         console.log(result);
//         console.log('------------------------------------------------------------\n\n');  
//         console.log(result[0].number);
//     });
//         iotsql.connection.end();
//     }
// }



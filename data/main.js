/*
 * Created by Administrator on 2017/5/10.
 */
var Mock=require('mockjs');
//node.js的写法
exports.data=function(){
    return [
        {
            route:"/index",
            handle:function(req,res,next){
                //req  请求头
                //res  响应的数据
                //res 请求头是模拟的后台数据返回告诉浏览器返回数据头，没有头的话数据出不来
                res.writeHead(200,{
                    "Content-type":"application/json;charset=utf-8",
                    "Access-Control-Allow-Origin":"*"//允许所有主机进行请求
                });
                var data={
                    name:"maodo",
                    age:"3",
                    address:"beijing"
                };
                res.write(JSON.stringify(data));
                res.end();//有开头有结尾不然数据依然无返回
            }
        },
        {
            route:"/smock",
            handle:function(req,res,next){
                //req  请求头
                //res  响应的数据
                //res 请求头是模拟的后台数据返回告诉浏览器返回数据头，没有头的话数据出不来
                res.writeHead(200,{
                    "Content-type":"application/json;charset=utf-8",
                    "Access-Control-Allow-Origin":"*"//允许所有主机进行请求
                });
                var Random=Mock.Random;
                Random.integer();
                Random.string("lower",4);
                Random.date("yyyy-MM-dd");
                var data=Mock.mock({
                    "menuList|6":[{
                        "menuNav":"@string()",
                        "menuNavContent|1-5":[{
                            "url":"index.html",
                            "name":"@string('lower',4)",
                            "id":"@integer(0,10)"
                        }]
                    }]
                });
                res.write(JSON.stringify(data));
                res.end();//有开头有结尾不然数据依然无返回
            }
        },
        {
            route:"/filter",
            handle:function(req,res,next){
                //req  请求头
                //res  响应的数据
                //res 请求头是模拟的后台数据返回告诉浏览器返回数据头，没有头的话数据出不来
                res.writeHead(200,{
                    "Content-type":"application/json;charset=utf-8",
                    "Access-Control-Allow-Origin":"*"//允许所有主机进行请求
                });
                var data=[
                    {
                        id: '1001',
                        name: "iphone4",
                        price: "3000"
                    },
                    {
                        id: '1002',
                        name: "iphone5",
                        price: "4000"
                    },
                    {
                        id: '1003',
                        name: "iphone6",
                        price: "5000"
                    },
                    {
                        id: '1004',
                        name: "iphone7",
                        price: "6000"
                    }
                ];
                res.write(JSON.stringify(data));
                res.end();//有开头有结尾不然数据依然无返回
            }
        }
    ]
};
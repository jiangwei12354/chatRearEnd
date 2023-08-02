var express = require("express");
var expressWs = require("express-ws");

var router = express.Router();
expressWs(router);  //将 express 实例上绑定 websocket 的一些方法
const clients = [];
const getParam = (url, param) => new URLSearchParams(new URL(url).search).get(param); // es6获取URL参数方法
router.ws("/user", function (ws, req) {
  let url = req.headers.origin + req.url; // example：ws://127.0.0.1:5201/?userId=liubao
  let userId = getParam(url, 'userId');
  if (userId) {
  clients.push({ userId:userId, ws: ws }); // 连接时只要url带userId参数，直接往客户端数组里塞入连接池信息
  }
  ws.send("你连接成功了");
  ws.on("message", function (msg) {
    // ws.send("pong" + msg);
    try {
      let objMessage = JSON.parse(`${msg}`); // example：{ 'userId': 'liubao', 'message': '给你一个小爱心' }
      let { userId, message } = objMessage;
      let count = 0; // 发送客户端数量
      if (userId) {
        clients.forEach(e => {
          let userText =JSON.stringify({userId: userId, message: message })
          e['ws'].send(userText);
          // if (e['userId'] === userId) {
          //   count++;
          //   e['ws'].send(`${message}`);
          // }
        });
        // ws.send(`已发送userId为${userId}的${count}个客户端`);
      } else {
        ws.send(JSON.stringify({ error: '请发送指定userId的客户端' }));
      }
    } catch (err) {
      ws.send(JSON.stringify({ error: err.message }));
    }
  });
})
// .get('/user', function(req, resp) {  // get方法
//   resp.send('response')
// });

module.exports = router;
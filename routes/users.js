var express = require('express');
var router = express.Router();
const { query, insert, update, remove } = require("../model/mysql");
const { verifyToken } = require("../common/common.js");
const random = require('string-random');
const jwt = require('jsonwebtoken')
const cors = require("cors");
router.use(cors()); //使用cors中间件


router.get('/get', function(req, res, next) {
	// db.querySql("select * from user",[],function(results,fields){
	// 	res.json({code: 200,data:results,message: '成功'});
	// });
  // 执行查询
  query(`SELECT * FROM user where userName='user'`, null, (error, results) => {
    if (error) {
      console.error(error);
    } else {
        jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjo3ODUsImlhdCI6MTY5MDQyODA1MCwiZXhwIjoxNjkwNDMxNjUwfQ.hy0tBy0jekqcSO5vObxCQeptTjNEySOplCqUD_vgDDw', 'Fizz', function (err, data) {
          if (err) { 
            res.status(401).json({ code: 401, data:null, message: 'token过期' });
          } else { 
            res.status(200).json({code: 200,data,message: '成功'});
            console.log('解析的数据', data)
            // console.log(results);
          }
        })
      // let token = jwt.sign({user: results[0].userId}, 'Fizz', {expiresIn: 60 * 60})
    }
  });
});
// console.log(random(3, {letters: false}));
  // const rule = {id: result[0].id, name: result[0].name }
/* GET users listing. */
router.post('/register', function (req, res) {
  console.log(req.body);
  res.header("Access-Control-Allow-Origin", "*");
  query(`SELECT * FROM user where userName='${req.body.userName}'`, null, (error, results) => {
    if (error) {
      console.error(error);
    } else {
    // console.log(err);
    console.log(results);
    //查询到为数组形式返回，如果返回为[]同data.length==0,则走注册后边的注册
      if (results.length !== 0) {
          let resData = {
              account: results[0].userName,
              passWord: results[0].passWord,
          };

          res.json({code: -1, data: resData, msg: '已注册'});
      } else {
        if (!req.body.userName) {
          res.json({code: 401, data: {},
            msg: '请输入账户名'});
            return 
        }
        
        if (!req.body.passWord) {
          res.json({code: 401, data: {},
            msg: '请输入密码'});
            return 
        }
        let userId=random(3, {letters: false})
        const user = { userName: req.body.userName, passWord: req.body.passWord, userId: userId };
        console.log(user);
        insert('user', user, (error, result) => {
          if (error) {
            console.error(error);
          } else {
              res.json({code: 200, data: result,
                  msg: '成功'});
          }
        });
      }
    }
	});
});       
/* 登录 */
router.post('/login', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  query(`SELECT * FROM user where userName='${req.body.userName}'`, null, (error, results) => {
    if (error) {
      console.error(error);
    } else {
      if (results.length==0) {
        return res.json({
          code: 500,
          msg: '该账号未注册',
          data: {},
        });
      } else {
        let token = jwt.sign({userId: results[0].userId}, 'Fizz', {expiresIn: 60 * 60})
        return res.json({
          code: 200,
          msg: '成功',
          data: {
            token:token
          },
        });
      }
    }
  });
});

   
/* 登录 */
router.get('/getInfo', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  let token =req.headers.authorization?req.headers.authorization.slice(7):''
  // console.log(res);
  verifyToken(token, (results) => {
  // verifyToken(token).then(function (value) {
    console.log(results);
    if (results.userId) {
      query(`SELECT * FROM user where userId='${results.userId}'`, null, (error, results) => {
        if (error) {
          console.error(error);
        } else {
          return res.json({
            code: 200,
            msg: '成功',
            data: results[0],
          });
        }
      });
    } else {
      res.status(401).json({ code: 401, data: null, message: 'token过期' });
    }
  })
});

module.exports = router;

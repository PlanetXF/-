const fs = require('fs');

// 回调函数的形式
// fs.readFile('./resource/content.txt', (err, data) => {
//     // 如果出错，抛出错误
//     if(err) throw err;
//     // 如果无错，输出内容
//     console.log(data.toString());
// })

// Promise的形式做一个封装
const p = new Promise((resolve, reject) => {
    fs.readFile('./resource/content.txt', (err, data) => {
        // 如果出错
        if(err) reject(err);
        // 如果成功
        resolve(data);
    })
});

p.then(value => {
    console.log(value.toString());
}, reason => {
    console.log(reason);
})

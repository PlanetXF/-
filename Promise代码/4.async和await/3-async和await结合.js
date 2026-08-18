/**
 * 
 * 读取resource文件下，三个html文件的内容
 * 
 * 
 */
const fs = require('fs');

const util = require('util');
const mineReadFile = util.promisify(fs.readFile);
// 形成回调地狱
// fs.readFile('./resource/1.html', (err, data1) => {
//     if(err) throw err;
//     fs.readFile('./resource/2.html', (err, data2) => {
//         if(err) throw err;
//         fs.readFile('./resource/3.html', (err, data3) => {
//             if(err) throw err;
//             console.log(data1 + data2 + data3);
//         })
//     })
// })

// fs.readFile('./resource/1.html', (err, data1) => {
//     if(err) throw err;
//     fs.readFile('./resource/2.html', (err, data2) => {
//         if(err) throw err;
//         fs.readFile('./resource/3.html', (err, data3) => {
//             if(err) throw err;
//             console.log(data1 + data2 + data3);
//         });
//     })
// })

let data1 = new Promise((resolve, reject) => {
    fs.readFile('./resource/1.html', (err, data) => {
        if(err) throw err;
        resolve(data);
    })
});
let data2 = new Promise((resolve, reject) => {
    fs.readFile('./resource/2.html', (err, data) => {
        if(err) throw err;
        resolve(data);
    })
});
let data3 = new Promise((resolve, reject) => {
    fs.readFile('./resource/3.html', (err, data) => {
        if(err) throw err;
        resolve(data);
    })
});

data1.then(v => {
    console.log(v.toString());
    return data2;
}).then(v => {
    console.log(v.toString());
    return data3;
}).then(v => {
    console.log(v.toString());
}).catch(r => {
    console.log(r);
})




// async 和 await
// async function main() {
//     try {
//         // 读取第一个文件
//         let data1 = await mineReadFile('./resource/1.html');
//         // 读取第二个文件
//         let data2 = await mineReadFile('./resource/2.html');
//         // 读取第三个文件
//         let data3 = await mineReadFile('./resource/3.html');
//         console.log(data1 + data2 + data3);
//     } catch (e) {
//         console.log(e);
//     }
    
// }
// main();

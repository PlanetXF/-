// 声明构造函数
function Promise(executor) {
    // 添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    // 增加一个属性，保存回调
    this.callbacks = [];
    // 保存实例对象的 this 的值
    const self = this; // self _this that
    // resolve 函数
    function resolve(data) {
        //判断状态，以确保对象状态只能修改一次
        if(self.PromiseState !== 'pending') return;
        // 1.修改对象状态
        self.PromiseState = 'fulfilled';
        // 2.设置对象结果
        self.PromiseResult = data;
        // 异步时执行成功回调
        setTimeout(function() {
            self.callbacks.forEach(item => {
                item.onResolved(data);
            });
        });
    }
    // reject 函数
    function reject(data) {
        // 判断状态，以确保对象状态只能修改一次
        if(self.PromiseState !== 'pending') return;
        // 1.修改对象状态
        self.PromiseState = 'rejected';
        // 2.设置对象结果
        self.PromiseResult = data;
        // 异步时执行失败回调
        setTimeout(function() {
            self.callbacks.forEach(item => {
                item.onRejected(data);
            });
        });
    }

    // 执行器函数是同步调用的
    try {
        executor(resolve, reject);
    } catch (e) {
        reject(e);
    }
    
}
// 添加then方法
Promise.prototype.then = function(onResolved, onRejected) {
    const self = this;
    // 实现异常穿透
    if(typeof onRejected !== 'function') {
        onRejected = reason => {
            throw reason;
        }
    }
    // 当第一个then没有第一个回调时，手动指定
    if(typeof onResolved !== 'function') {
        onResolved = value => value;
        // 等价于 onResolve = value => { return value };
    }
    return new Promise((resolve, reject) => {
        // 封装函数
        function callback(type) {
                try {
                    let result = type(self.PromiseResult);
                    if(result instanceof Promise) {
                        result.then(v => {
                            resolve(v);
                        }, r => {
                            reject(r);
                        })
                    }else {
                        resolve(result);
                    }
                } catch (e) {
                    reject(e);
                }
        }
        // 调用回调函数  PromiseState
        if(this.PromiseState === 'fulfilled') {
            setTimeout(function() {
                callback(onResolved);
            });
        }
        if(this.PromiseState === 'rejected') {
            setTimeout(function() {
                callback(onRejected);
            });
        }
        // 状态是 pending 时
        if(this.PromiseState == 'pending') {
            this.callbacks.push({
                onResolved: function() {
                    callback(onResolved);
                },
                onRejected: function() {
                    callback(onRejected);
                }
            });
        }
    });
}
// 添加catch方法
Promise.prototype.catch = function(onRejected) {
    return this.then(undefined, onRejected);
}
// 添加resolve方法
Promise.resolve = function(value) {
    // 返回Promise对象
    return new Promise((resolve, reject) => {
        if(value instanceof Promise) {
            value.then(v => {
                resolve(v);
            }, r => {
                reject(r);
            });
        }else{
            // 状态设置成功
            resolve(value);
        }
    })
}
// 添加reject方法
Promise.reject = function(reason) {
    // 返回一个Promise对象
    return new Promise((resolve, reject) => {
        reject(reason);
    })
}
// 添加all方法
Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
        // 计数器
        let count = 0;
        // 返回结果
        let arr = [];
        for(let i=0; i<promises.length; i++) {
            promises[i].then(v => {
                count++;
                arr[i] = v;
                if(count === promises.length) {
                    resolve(arr);
                }
            }, r => {
                reject(r);
            });
        }
    })
}
// 添加race方法
Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
        for(let i=0; i<promises.length; i++) {
            promises[i].then(v => {
                resolve(v);
            }, r => {
                reject(r);
            });
        }
    });
    
}
function Promise(executor) {
    this.promiseState = 'pending';
    this.promiseResult = null;
    this.callbacks = [];
    let self = this;
    function resolve(data) {
        if(self.promiseState !== 'pending') return;
        self.promiseState = 'fulfilled';
        self.promiseResult = data;
        setTimeout(function() {
            self.callbacks.forEach(item => {
                item.onResolved(data);
            });
        });
    }
    function reject(data) {
        if(self.promiseState !== 'pending') return;
        self.promiseState = 'rejected';
        self.promiseResult = data;
        setTimeout(function() {
            self.callbacks.forEach(item => {
                item.onRejected(data);
            });
        });
        
    }
    try{
        executor(resolve, reject);
    }catch(e){
        reject(e);
    }
    
}

Promise.prototype.then = function(onResolved, onRejected) {
    const self = this;
    if(typeof onRejected !== 'function') {
        onRejected = reason => {
            throw reason;
        } 
    }
    if(typeof onResolved !== 'function') {
        onResolved = value => value;
    }
    return new Promise((resolve, reject) => {
        if(this.promiseState === 'fulfilled') {
            setTimeout(function() {
                let result = onResolved(this.promiseResult);
                if(result instanceof Promise) {
                    result.then(v => {
                        resolve(v);
                    }, r => {
                        reject(r);
                    })
                }else{
                    resolve(result);
                }
            });
        }
        if(this.promiseState === 'rejected'){
            try{
                setTimeout(function() {
                    let result = onRejected(this.promiseResult);
                    if(result instanceof Promise) {
                        result.then(v => {
                            resolve(v);
                        }, r => {
                            reject(r);
                        });
                    }else {
                        resolve(result);
                    }
                });
            }catch(e) {
                reject(e);
            }
        }
        if(this.promiseState === 'pending') {
            this.callbacks.push({
                onResolved: function() {
                    try{
                        let result = onResolved(self.promiseResult);
                        if(result instanceof Promise) {
                            result.then(v => {
                                resolve(v);
                            }, r => {
                                reject(r);
                            })
                        }else {
                            resolve(result);
                        }
                    }catch(e) {
                        reject(e);
                    }     
                },
                onRejected: function() {
                    try{
                        let result = onRejected(self.promiseResult);
                        if(result instanceof Promise) {
                            result.then(v => {
                                resolve(v);
                            }, r => {
                                reject(r);
                            })
                        }else {
                            resolve(result);
                        }
                    }catch(e) {
                        reject(e);
                    }
                }
            });
        }
    })
}

Promise.prototype.catch = function(onRejected) {
    return this.then(undefined, onRejected);
}

Promise.resolve = function(value) {
    return new Promise((resolve, reject) => {
        if(value instanceof Promise) {
            value.then(v => {
                resolve(v);
            }, r => {
                reject(r);
            });
        }else {
            resolve(value);
        }
    });
}

Promise.reject = function(value) {
    return new Promise((resolve, reject) => {
        if(value instanceof Promise) {
            value.then(v => {
                reject(v);
            }, r => {
                reject(r);
            });
        }else {
            reject(value);
        }
    });
}

Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
        let len = promises.length;
        let res = new Array(len);
        let count = 0;
        for(let i=0; i<len; i++) {
            Promise.resolve(promises[i]).then(v => {
                res[i] = v;
                count++;
                if(count === res.length){
                    resolve(res);
                }
            }, r => {
                reject(r);
            });
        }
    });
}

Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
        for(let i=0; i<promises.length; i++) {
            Promise.resolve(promises[i]).then(v => {
                resolve(v);
            }, r => {
                reject(r);
            })
        }
    });
}
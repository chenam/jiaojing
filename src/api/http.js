import axios from 'axios'
import { Message } from 'element-ui';
import store from '../store'
import router from '../router'
import localDb from '../util/localDb'
import qs from 'qs'

//系统所有请求路径
const baseUrl = process.env.API_URL ? process.env.API_URL : '';

var service=axios.create({
    baseURL:process.env.BASE_API,
    timeout:5000
})

function isLogin() {
    return localDb.get('session')
}


//添加请求拦截器
service.interceptors.request.use(function(config){
    // console.log(localDb.get('TOKEN'),'dddd')
    if(localDb.get('TOKEN',true)){
        config.headers['x-auth-token'] = localDb.get('TOKEN',true)
    }else if(localDb.get('TOKEN',false)){
        config.headers['x-auth-token'] = localDb.get('TOKEN',false)
    }
    return config
},function(error){
    return Promise.reject(error)
})

//添加响应拦截器
service.interceptors.response.use(function(response){
    
    /**
    * 下面的注释为通过在response里，自定义code来标示请求状态
    * 当code返回如下情况则说明权限有问题，登出并返回到登录页
    * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
    */
   // response => {
   //   const res = response.data
   //   if (res.code !== 20000) {
   //     })
   //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
   //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
   //       }).then(() => {
   //         })
   //       })
   //     }
   //     return Promise.reject('error')
   //   } else {
   //     return response.data
   //   }
   // },

    // if(response && response.headers && response['headers']['x-auth-token']){
    //     localDb.set('TOKEN',response['headers']['x-auth-token'])
    // }
  
        return response
    },function(error){
        console.log('err',error)
        // 清空token，跳转到登陆页
        if(error && error.response){
            if(error.response.status === 401){
                Message({
                    message:error.response.data.error_msg,
                    type:'error',
                    duration: 4*1000 
                })
                // 清除TOKEN

                // 跳转页面
                router.replace({
                    path: 'login',
                    query: {redirect: router.currentRoute.fullPath}
                })
            // 无权限
            }else if(error.response.status === 403){
                Message({
                    message:'权限错误！',
                    type:'error',
                    duration: 4*1000 
                })
            }
        }
        
        
        return Promise.resolve(error)
    }
 )

class Http {
    /* eslint-disable */
    get(url, params, callback) { // GET请求
        const newUrl = params ? this.build(url, params) : url
        let options = {
            method: 'GET'
        }
        // console.log(params,'sss')
        // if (params) options.body = params
        return this.request(newUrl, options, callback)
    }

    post(url, body, callback) { // POST请求
        let options = {
            method: 'POST'
        }
        if (body) options.body = body
        return this.request(url, options, callback,0)
    }
    // postRes(url, body, callback,resCallBack) { // POST请求
    //     let options = {
    //         method: 'POST'
    //     }
    //     if (body) options.body = JSON.stringify(body)
    //     return this.request(url, options, callback,1)
    // }
    // postAsFormData(url, params, callback) {
    //     let options = {
    //         method: 'POST'
    //     }
    //     if (params) options.body = this.buildFormData(params)
    //     return this.request(url, options, callback)
    // }

    // postForm(url, form, callback) {
    //     let options = {
    //         method: 'POST'
    //     }
    //     if (form) options.body = new FormData(form)
    //     return this.request(url, options, callback)
    // }

    request(url, options, callback,resCallBack) {
        // options.credentials = 'same-origin'
        // options.headers = this.defaultHeader()//默认headers
        return service({
                method: options.method,
                url: url,
                data: options.body ? options.body : {}
            }).then(function(response) {
                //模拟数据
                //请求返回处理
                return response;
                // if (!response) {
                //     throw "服务器返回参数错误"
                // } else if (response.result == true){
                //     //处理数据
                //     if(!resCallBack){
                //         callback(response.data)
                //     }else{
                //         callback(response);
                //     }
                // }else if (response.result == false){
                //     //错误的情况
                //     console.log('err'+error)
                //     message.warning(response.result_message);

                // } else if (response.errcode == 40001) {

                //     throw "token失效，请刷新页面"
                // } else if (response.errcode == -1) {

                //     return response
                // }
            })
            .catch(function (error) {
                // alert(2333)
                console.log(error,'err')
                return Promise.resolve(error)
            });
    }
    
    defaultHeader() { // 默认头
        const header = {
            'Accept': '*/*',
            'Content-Type': 'application/json',
        };
        return header
    }

    build(url, params) { // URL构建方法
        const ps = []
        if (params) {
            for (let p in params) {
                if (p) {
                    ps.push(p + '=' + encodeURIComponent(params[p]));
                }
            }
        }
        return url + '?' + ps.join('&')
    }

    buildFormData(params) {
        if (params) {
            const data = new FormData()
            for (let p in params) {
                if (p) {
                    data.append(p, params[p])
                }
            }
            return data;
        }
    }
}
/* eslint-disable */
export default new Http()
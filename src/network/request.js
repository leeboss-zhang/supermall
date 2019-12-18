import axios from 'axios'
export function request(config){
     //1.创建axios的实例
    const instance = axios.create({
        baseURL: 'http://106.54.54.237:8000',
        timeout: 5000
    })
    //发送真正的网络请求
//axios的拦截器
//请求拦截的要求
instance.interceptors.request.use(config =>{
    //console.log(config);
    //每次发送网络请求，界面出现一个请求图标
    //某些网络请求，携带一些特殊信息
    return config
},err =>{
  //  console.log(err);
}); 
    //2.2响应拦截
    instance.interceptors.response.use(res => {
   //     console.log(res);
        return res.data
    },err => {
    //    console.log(err)
    })
    return instance(config)
    }




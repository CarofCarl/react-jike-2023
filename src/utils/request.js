// axios的封装处理
import axios from "axios";
import { getToken, removeToken } from "./token";
import router from "@/router";
// 1. 根域名配置
// 2. 超时时间
// 3. 请求拦截器 / 响应拦截器

const request = axios.create({
  baseURL: "http://geek.itheima.net/v1_0",
  timeout: 5000,
});

// 添加请求拦截器
// 在请求发送之前 做拦截 插入一些自定义的配置 [参数的处理]
request.interceptors.request.use(
  (config) => {
    // 操作这个config 注入token数据
    // 1. 获取到token
    // 2. 按照后端的格式要求做token拼接
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器 - 用于统一处理所有HTTP请求的响应
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 4. 打印完整的错误信息到控制台，便于调试
    //    运行结果: 详细的错误对象，包含状态码、错误信息等
    console.dir(error);
    // 5. 判断是否为 401 错误(未授权，通常表示Token已失效)
    if (error.response.status === 401) {
      // 6. 清除本地存储的Token
      removeToken();
      // 7. 跳转到登录页面
      router.navigate("/login");
      // 8. 刷新页面，确保应用状态完全重置
      //    运行结果: 页面重新加载，清除所有内存中的状态
      window.location.reload();
    }

    // 9. 继续向外抛出错误，让调用此请求的代码也能感知到错误
    //    运行结果: Promise进入rejected状态，后续的catch可以捕获到error
    return Promise.reject(error);
  }
);

export { request };

//开发   哪个阶段就放开那个 
let baseURL = 'http://localhost:3000'
// //测试
// let baseURL = 'http://ajax.frontend.itheima.net'
// //生产
// let baseURL = 'http://ajax.frontend.itheima.net'

//所有ajax发送出去之前，都会调用这个函数
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url

    //包含/my/路径的请求，就要手动添加 Authorization属性
    if (options.url.indexOf("/my/") !== -1 || options.url.indexOf("/article/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('myToken') || ''
        }

        //登陆拦截(没有登陆就强制登陆)
        // options.complete = function (res) {
        //     // console.log(res.responseJSON);
        //     let obj = res.responseJSON;
        //     //后台返回的“身份认证失败！” 感叹号是中文的，去复制以免失败
        //     if (obj.status == 1 && obj.message === "身份认证失败！") {
        //         //跳转到登陆页面，销毁token
        //         localStorage.removeItem('myToken');
        //         location.href = "/login.html";
        //     }
        // }
    }


})



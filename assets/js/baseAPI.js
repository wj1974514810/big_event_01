//开发   哪个阶段就放开那个 
let baseURL = 'http://ajax.frontend.itheima.net'
// //测试
// let baseURL = 'http://ajax.frontend.itheima.net'
// //生产
// let baseURL = 'http://ajax.frontend.itheima.net'

$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url
})
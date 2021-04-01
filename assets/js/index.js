$(function () {
    //后面页面液要用
    getUserInfo();


    //退出
    let layer = layui.layer;
    $('#btnLogout').on('click', function () {
        //弹窗，
        layer.confirm('是否确定退出', { icon: 3, title: '提示' }, function (index) {
            //清空本地myToken
            localStorage.removeItem('myToken');
            location.href = "/login.html";
            //关闭询问框
            layer.close(index);
        });
    })
})

//封装全局函数 获取用户信息 getUserInfo()
var id = ''
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: "GET",
        //配置头信息，设置token，身份识别认证
        // headers: {
        //     //请求头
        //     Authorization: localStorage.getItem('myToken') || ''
        // },
        success: function (res) {
            // console.log(res);
            // console.log(res.data[0].id);
            id = res.data[0].id
            renderAvatar(res.data[0]);
            // if (res.status != 0) return layui.layer.msg(res.message, { icon: 5 });

            //头像和文字渲染
        },
        //无论请求成功或失败都会触发
        // complete: function (res) {
        //     // console.log(res.responseJSON);
        //     let obj = res.responseJSON;
        //     if (obj.status && obj.message === "身份认证失败！") {
        //         //跳转到登陆页面，销毁token
        //         localStorage.removeItem('myToken');
        //         location.href = "/login.html";
        //     }
        // }
    })
}

//头像和文字渲染封装
function renderAvatar(user) {
    // console.log(user);
    //1、渲染用户名，如果有昵称以昵称为准
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;' + name);
    //2、渲染头像，有头像用头像，没头像用name
    if (user.user_pic == null) {
        //渲染文字头像，隐藏图片头像
        $('.layui-nav-img').hide();
        // console.log(name);
        $('.text-avatar').html(name[0].toUpperCase());
    } else {
        //渲染图片头像，隐藏文字头像
        $('.layui-nav-img').attr('src', user.user_pic);
        $('.text-avatar').hide();
    }
}



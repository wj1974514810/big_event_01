$(function () {
    //校验规则定义
    let form = layui.form;
    form.verify({
        nickname: function (value) {
            let length = value.trim().length;
            if (length < 1 || length > 6) {
                return '用户昵称必须在1-6位之间'
            }
        }
    })

    //展示用户信息  后面还要用 封装函数
    initUserInfo();

    //用户渲染
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            //method==type
            method: 'GET',
            success: function (res) {
                console.log(res.data);
                //失败返回
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                }
                //成功渲染
                //第一个参数必须跟表单里的lay-filter属性的值一样
                form.val('formUserInfo', res.data[0])
            }
        })
    }

    //重置
    $('#btnReset').on('click', function (e) {
        //阻止重置
        e.preventDefault();
        //用上面的用户渲染方法实现
        initUserInfo();
    })

    //修改信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/userinfo',
            method: 'POST',
            // data: $(this).serialize(),
            data: {
                id: window.parent.id,
                nickname: $('[name=nickname]').val(),
                email: $('[name=email]').val()
            },
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('用户信息修改失败', { icon: 5 })
                }
                layer.msg('用户信息修改成功', { icon: 6 });
                //此处的window代表user_info页面
                // console.log(window);
                //此处的window.parent代表index.html页面
                // console.log(window.parent);
                //调用index.html页面中的全局函数getUserInfo()
                window.parent.getUserInfo();
            }
        })
    })

})
$(function () {
    //1、定义密码规则
    let form = layui.form;
    form.verify({
        //密码
        pwd: [
            /^[\S]{6,16}$/, "密码必须6-16位，且不能输入空格"
        ],
        //新密码
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return "新密码和原密码不能重复！"
            }
        },
        //确认密码
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return "两次输入密码不一致！"
            }
        }
    });


    //修改密码
    $('form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/updatepwd',
            type: 'post',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg('恭喜您，密码修改成功！', { icon: 6 });
                $('form')[0].reset();
            }
        })
    })


    //重置密码

})
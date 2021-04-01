$(function () {
    //1.文章类别列表展示
    iniArtCateList();
    //封装函数用于引擎模板的使用
    function iniArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/article/cates',
            success: (res) => {
                console.log(res);
                console.log(res.data);
                //状态判断
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                //获取不用弹框
                let htmlStr = template('tpl-art-cate', { data: res.data });
                $('tbody').html(htmlStr);
            }
        })
    }


    //添加类别
    let indexAdd = null;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        });
    })

    //3、事件代理完成添加文章分类
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/article/addcates',
            type: 'post',
            // data: $(this).serialize(),
            data: {
                name: $('[name=name]').val(),
                slug: $('[name=alias]').val()
            },
            success: function (res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //清空表单
                $('#form-add')[0].reset();
                //刷新页面
                iniArtCateList();
                //关闭对话框
                layer.close(indexAdd);
            }
        })
    })
    //4、修改文章分类
    let indexEdit = null;
    let form = layui.form;
    let ID = ''
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        });
        ID = $(this).attr("data-id");
        console.log(ID);
        $.ajax({
            url: '/article/cates/',
            type: 'get',
            data: { id: ID },
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data)
            }
        })
    })


    //5、提交修改文章分类
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/article/updatecate',
            type: 'post',
            data: $(this).serialize(),
            data: {
                id: ID,
                name: $('[name=name]').val(),
                slug: $('[name=alias]').val()
            },
            success: function (res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg('更新文章成功');
                //清空表单
                $('#form-edit')[0].reset();
                //刷新页面
                iniArtCateList();
                //关闭弹框
                layer.close(indexEdit);
            }
        })
    })

    //6、删除
    $('tbody').on('click', '.btn-delete', function () {
        //获取id
        let Id = $(this).attr("data-id");
        // alert(Id)
        //对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/article/deletecate',
                type: 'get',
                data: {
                    id: Id
                },
                success: function (res) {
                    console.log(1);
                    console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    iniArtCateList();
                    layer.msg('删除成功');
                    // layer.close(index);
                }
            })
        })

    })

})
$(function () {
    //初始化文章分类
    let layer = layui.layer;
    // let form = layui.form;
    initCate();
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                let htmlStr = template('tpl-cate', { data: res.data });
                $('[name=cate_id]').html(htmlStr);
                //对于select标签，赋值之后需要重新渲染
                layui.form.render();
            }
        })
    }

    //初始化富文本编辑器
    initEditor()


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    //4 选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    //5、选择文件，同步修改图片预览区域
    $('#coverFile').on('change', function (e) {
        //拿到用户选择的文件
        var file = e.target.files[0]
        if (file === undefined) {
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', '')  // 设置图片路径为空
            return layer.msg('您可以选择一张图片，作为文章封面');
        }
        //根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //6、参数状态值处理
    let state = '已发布';    //设为默认值可以不写下面注释的事件
    // $('#btnSave1').on('click', function () {
    //     state = '已发布'
    // })
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    //7、发布文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //发布文章是上传文件，要使用FormData类型的操作
        let fd = new FormData(this);
        fd.append('state', state);
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // console.log(...fd);
                publishArticle(fd);
            });
    })


    //封装添加文章函数
    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/add',
            method: 'post',
            data: fd,
            processData: false,
            contentType: false,
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg("发布成功！")
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click();
                }, 1000)
            }
        })
    }
})
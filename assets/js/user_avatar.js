$(window).on('load', function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    let options = {
        // 纵横比
        aspectRatio: 1,
        // aspectRatio: 9 / 8,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    //点击按钮，上传图片
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    //选择图片后，修改裁剪区域
    $('#file').on('change', function (e) {
        //拿到用户选择的文件，e.target==this  
        //e.target 在事件冒泡处理的比较好，所以用它
        let file = e.target.files[0];
        //非空校验
        if (file === undefined) return layer.msg('用户头像必传');
        //根据选择的文件，创建一个对应的URL地址
        let newImgURL = URL.createObjectURL(file);
        //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //上传头像
    $('#btnUpload').on('click', function () {
        //获取base 64格式的字符串（头像）
        let dataURL =
            // 创建一个 Canvas 画布
            $image.cropper('getCroppedCanvas', {
                width: 100,
                height: 100
                // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            }).toDataURL('image/png')


        $.ajax({
            url: '/my/update/avatar',
            type: 'post',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('头像上传失败');
                }
                layer.msg('头像上传成功');
                window.parent.getUserInfo();
            }
        })
    })


})
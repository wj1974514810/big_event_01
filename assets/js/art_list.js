$(function () {
    //向模板引擎中导入函数
    template.defaults.imports.dateFormat = function (dtstr) {
        let dt = new Date(dtstr);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth());
        let d = padZero(dt.getDate());
        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    //如果大于9 就是本身，否则前面+0
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    //定义查询参数
    let q = {
        pagenum: 0,   //页码值
        pagesize: 5,    //每页显示多少数据
        cate_id: '',    //文章分类的Id
        state: ''       //文章的状态
    }

    //初始化文章列表
    initTable();

    //封装初始化文章列表函数
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            type: 'get',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //渲染
                let htmlStr = template('tpl-table', { data: res.data })
                $('tbody').html(htmlStr);
                //文章列表初始化完毕做分页
                renderPage(res.total);
            }
        })
    }

    // let form = layui.form;
    //初始化文章分类
    initCate();
    function initCate() {
        $.ajax({
            url: '/article/cates',
            method: 'get',
            success: function (res) {
                // console.log(res);
                // console.log(res.data);
                // console.log(res.data[0]);
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


    //筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        //获取
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        //赋值
        q.cate_id = cate_id;
        q.state = state;
        //再次渲染文章列表
        initTable();
    })


    //分页
    function renderPage(total) {
        // alert(total);
        var laypage = layui.laypage;

        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,  //每页显示几条
            curr: q.pagenum,//初始化页面(当前页)
            //自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //每页条数
            limits: [2, 3, 4, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数

                //首次不执行
                if (!first) {
                    //do something
                    //页码值赋值给q中的pagenum 
                    q.pagenum = obj.curr;
                    //页码条数赋值给q中的pagesize
                    q.pagesize = obj.limit;
                    //重新渲染
                    initTable();
                }
            }
        });
    }

    //删除
    $('tbody').on('click', '.btn-delete', function () {
        //获取id
        let Id = $(this).attr("data-id");
        //对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/delete',
                method: 'get',
                data: {
                    id: Id
                },
                success: function (res) {
                    console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功');
                    //如果最后一个页面只剩最后一个元素，当前页码还要大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    initTable();

                }
            })
            layer.close(index);
        })

    })
})
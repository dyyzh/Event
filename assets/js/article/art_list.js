let { layer, form, laypage } = layui;
$(function () {
  // 定义一个查询的参数对象，请求数据的时候，需要将请求参数对象提交到服务器
  let params = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }

  initTable();
  initCate();

  //过滤器
  template.defaults.imports.dataFormat = function (val) {
    const dt = new Date(val)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = dt.getHours()
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(time) {
    return time > 10 ? time : '0' + time
  }

  //渲染文章列表
  function initTable() {
    $.ajax({
      type: 'GET',
      url: '/my/article/list',
      data: params,
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('失败，请重试！', { icon: 5 });
        }
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)

        renderPage(res.total);
      }
    })
  }

  //渲染文章分类下拉框
  function initCate() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      data: {},
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('失败，请重试！', { icon: 5 });
        }
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        //重新渲染表单区域的UI结构
        form.render()
      }
    })
  }

  //
  $('#form-search').on('submit', function (e) {
    e.preventDefault();

    let cateVal = $('[name=cate_id]').val();
    let stateVal = $('[name=state]').val();

    params.cate_id = cateVal;
    params.state = stateVal;

    initTable();
  })

  //渲染分页
  function renderPage(totalPage) {
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id,不能加 # 号
      count: totalPage, // 总数据条数
      limit: params.pagesize, // 每页显示几条数据
      curr: params.pagenum, // 设置默认被选中的分页
      // 分页发生切换的时候，触发 jump 回调
      jump: function (obj, first) {
        // 把最新的页码值，赋值给参数
        params.pagenum = obj.curr;
        params.pagesize = obj.limit;
        //点击页码(first=false)时调用函数
        if (!first) {
          initTable();
        }
      },
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 4, 6, 10],

    })
  }

  //删除文章
  $('tbody').on('click', '#btn-del', function (index) {
    let id = $(this).attr('data-id');
    let btnDelLen = $(this).length;

    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        type: 'GET',
        url: '/my/article/delete/' + id,
        data: {},
        success: function (res) {
          if (res.status != 0) {
            return layer.msg('删除失败，请重试！', { icon: 5 });
          }

          layer.msg('删除成功！', { icon: 6 });
          //删除按钮 = 1 且页码数 != 1
          if (btnDelLen == 1 && params.pagenum != 1) {
            params.pagenum -= 1
          }
          initTable();
        }
      })
      layer.close(index)
    })

  })
})
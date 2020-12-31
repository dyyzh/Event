let { layer } = layui;
let { form } = layui;
$(function () {
  initArtCateList()

  //获取文章数据并渲染到页面上
  function initArtCateList() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      data: {},
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('文章获取失败，请重试！', { icon: 5 });
        }
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  //添加分类功能
  let addIndex = null;
  $('#btnAddCate').on('click', function () {
    addIndex = layer.open({
      type: 1,
      area: ['700px', '300px'],
      title: '添加文章分类',
      content: $('#tpl-dialog').html()
    })
  })

  //确认添加功能
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('添加文章失败，请重试！', { icon: 5 });
        }

        initArtCateList()
        layer.msg('添加文章成功！', { icon: 6 });
        layer.close(addIndex)

      }
    })
  })

  //点击编辑
  let editIndex = null;
  $('tbody').on('click', '#btn-edit', function (e) {
    editIndex = layer.open({
      type: 1,
      area: ['700px', '300px'],
      title: '修改文章分类',
      content: $('#tpl-edit').html()
    })

    //将当前编辑内容渲染到弹出框
    let id = $(this).attr('data-id')
    $.ajax({
      type: 'GET',
      url: '/my/article/cates/' + id,
      data: {},
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('添加文章失败，请重试！', { icon: 5 });
        }

        form.val('form-edit', res.data)
      }
    })
  })

  //编辑内表单确认修改
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('修改文章失败，请重试！', { icon: 5 });
        }

        initArtCateList()
        layer.msg('修改文章成功！', { icon: 6 });
        layer.close(editIndex)
      }
    })
  })

  //删除
  $('tbody').on('click', '#btn-del', function () {
    let id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        type: 'GET',
        url: '/my/article/deletecate/' + id,
        data: {},
        success: function (res) {
          if (res.status != 0) {
            return layer.msg('删除文章失败，请重试！', { icon: 5 });
          }
          initArtCateList()
          layer.msg('删除文章成功！', { icon: 6 });
          layer.close(index)
        }
      })
    })
  })
})
let { layer } = layui;
$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  let $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  //上传控件隐藏
  // $('#file').hide()
  $('#file').css('display', 'none')
  //点击上传按钮触发上传事件
  $('#btnChooseImg').on('click', function () {
    $('#file').click()
  })

  $('#file').on('change', function (e) {
    // console.log(e);
    let fileList = e.target.files;
    if (fileList.length == 0) {
      return layer.msg('请选择图片！', { icon: 5 });
    }

    let file = fileList[0]
    let imgUrl = URL.createObjectURL(file)
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgUrl) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  $('#btnUpload').on('click', function () {
    let dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      }).toDataURL('image/png')

    $.ajax({
      type: 'POST',
      url: '/my/update/avatar',
      data: { avatar: dataURL },
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('头像更新失败，请重试！', { icon: 5 });
        }
        layer.msg('头像更新成功！', { icon: 6 });
        window.parent.getUserInfo();
      }
    })
  })
})
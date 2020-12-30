let { form } = layui
let { layer } = layui
$(function () {
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须小于6位'
      }
    }
  })

  initUserInfo()

  function initUserInfo() {
    $.ajax({
      type: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('获取用户信息失败，请重试！', { icon: 5 });
        }
        // console.log(res);
        form.val('formUserInfo', res.data)
      }
    })
  }

  $('#reset').on('click', function (e) {
    e.preventDefault();
    initUserInfo()
  })

  $('.layui-form').on('submit', function (e) {
    e.preventDefault();

    $.ajax({
      type: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('更新用户信息失败，请重试！', { icon: 5 });
        }
        layer.msg('更新用户信息成功！', {icon: 6});
        window.parent.getUserInfo()
      }
    })
  })
})
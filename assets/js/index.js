let { layer } = layui;
// let layer = layui.layer
$(function () {
  getUserInfo()

  $('#btnLogout').on('click', function () {
    layer.confirm('确定退出?', { icon: 3, title: '提示' }, function (index) {
      //删除本地token
      localStorage.removeItem('token')
      //跳转到登录页面
      location.href = './login.html'
      layer.close(index);
    })
  })
})
//封装获取用户信息函数
function getUserInfo() {
  $.ajax({
    type: 'GET',
    url: '/my/userinfo',
    // headers: {
    //   Authorization: localStorage.getItem('token')
    // },
    success: function (res) {
      if (res.status != 0) {
        return layer.msg('获取用户信息失败，请重试！', { icon: 5 });
      }
      renderAvatar(res.data)
    }
    // complete: function (res) {
    //   // console.log(res);
    //   if (res.responseJSON.status == 1 && res.responseJSON.message === '身份认证失败！') {
    //     localStorage.removeItem('token')
    //     location.href = './login.html'
    //   }
    // }
  })
}
function renderAvatar(data) {
  let uname = data.nickname || data.username;
  $('#welcome').html(`欢迎${uname}`)
  // $('#welcome').html('欢迎' + uname)
  if (data.user_pic) {
    $('.layui-nav-img').attr('src', data.user_pic).show();
    $('.text-avatar').hide();
  } else {
    let fstName = uname[0].toUpperCase();
    $('.text-avatar').html(fstName).show();
    $('.layui-nav-img').hide()
  }
}
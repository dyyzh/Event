$(function () {

  //去注册
  $('#linkReg').on('click', function () {
    $('.loginbox').hide().siblings('.regbox').show()
  })

  //去登录
  $('#linkLogin').on('click', function () {
    $('.loginbox').show().siblings('.regbox').hide()
  })

  //从layui中获取form对象
  // let form = layui.form;
  let { form } = layui;
  form.verify({ 
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value) {
      let pwdVal = $('.regbox [name=password]').val();
      if (pwdVal !== value) {
        return '两次密码不一致，请重试！'
      }
    }
  })

  //监听form表单注册提交事件
  let { layer } = layui;
  $('#form-reg').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/api/reguser',
      data: {
        username: $('#form-reg [name=username]').val(),
        password: $('#form-reg [name=password]').val(),
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('注册失败，请重试！', {icon: 5});
        }
        layer.msg(res.message, {icon: 6});
        $('#linkLogin').click()
      }
    })
  })

  //监听form表单登录提交事件
  $('#form-login').on('submit', function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败，请重试！', {icon: 5});
        }
        debugger;
        layer.msg('登录成功！', {icon: 6});
        localStorage.setItem('token', res.token);
        location.href = './index.html'
      }
    })
  })
})
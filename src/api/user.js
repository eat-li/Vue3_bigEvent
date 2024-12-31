import request from '@/utils/request'

//注册接口
export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', { username, password, repassword })
}

//登录接口
export const userLoginService = ({ username, password }) => {
  return request.post('/api/login', { username, password })
}

//获取用户信息接口
//token已经在请求拦截器中添加了，这里就不用加了
export const UserGetInfoService = () => {
  return request.get('/my/userinfo')
}

//更新用户基本信息
export const userUpdateInfoService = ({ id, nickname, email }) => {
  return request.put('/my/userinfo', { id, nickname, email })
}

//上传用户头像
export const userUploadAvatarService = (avatar) => request.patch('/my/update/avatar', { avatar })

//修改密码
export const userUpdatePasswordService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })

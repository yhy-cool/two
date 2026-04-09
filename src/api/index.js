import service from './axios'

// 示例接口
export const login = (data) => {
  // 模拟登录成功，返回假的 token
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ token: 'fake-token-123456' })
    }, 500)
  })
  // 真实接口调用
  // return service({
  //   url: '/login',
  //   method: 'post',
  //   data
  // })
}

export const getUserInfo = () => {
  return service({
    url: '/user/info',
    method: 'get'
  })
}

// 可以根据业务需求添加更多接口
import service from './axios'

// 示例接口
export const login = (data) => {
  return service({
    url: '/login',
    method: 'post',
    data
  })
}

export const getUserInfo = () => {
  return service({
    url: '/user/info',
    method: 'get'
  })
}

// 可以根据业务需求添加更多接口
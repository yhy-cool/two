import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

// 读取模拟数据
const dbPath = path.resolve(__dirname, 'server', 'db.json')
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [
      vue(),
      {
        name: 'api-handler',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // 处理登录请求
            if (req.url === '/api/login' && req.method === 'POST') {
              let body = ''
              req.on('data', chunk => {
                body += chunk.toString()
              })
              req.on('end', () => {
                try {
                  const { username, password } = JSON.parse(body)
                  const user = db.users.find(u => u.username === username && u.password === password)
                  if (user) {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ code: 200, token: user.token, message: '登录成功' }))
                  } else {
                    res.setHeader('Content-Type', 'application/json')
                    res.statusCode = 401
                    res.end(JSON.stringify({ code: 401, message: '用户名或密码错误' }))
                  }
                } catch (error) {
                  res.setHeader('Content-Type', 'application/json')
                  res.statusCode = 400
                  res.end(JSON.stringify({ code: 400, message: '请求参数错误' }))
                }
              })
            } else if (req.url === '/api/user/info' && req.method === 'GET') {
              // 处理获取用户信息请求
              const token = req.headers.authorization?.split(' ')[1]
              const user = db.users.find(u => u.token === token)
              if (user) {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ code: 200, data: { username: user.username }, message: '获取成功' }))
              } else {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 401
                res.end(JSON.stringify({ code: 401, message: '未授权' }))
              }
            } else {
              next()
            }
          })
        }
      }
    ],
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  }
})

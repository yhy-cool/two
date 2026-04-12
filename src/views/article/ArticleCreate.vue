<template>
  <div class="article-create">
    <!-- 顶部标签栏 -->
    <div class="article-tabs">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a href="#/article/list">个人中心</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="#/article/list">创建文章</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="#/article/list">文章内容</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="#/article/list">文章详情</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="#/article/create" class="active">文章编辑</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>创建文章</span>
        </div>
      </template>
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="内容">
          <div class="editor-container">
            <!-- 编辑器模式切换 -->
            <div class="editor-mode">
              <el-button :type="editorMode === 'markdown' ? 'primary' : 'default'" @click="editorMode = 'markdown'">markdown</el-button>
              <el-button :type="editorMode === 'rich' ? 'primary' : 'default'" @click="editorMode = 'rich'">富文本</el-button>
            </div>
            
            <!-- 工具栏 -->
            <div class="editor-toolbar">
              <el-button size="small" @click="insertMarkdown('# ')">H</el-button>
              <el-button size="small" @click="insertMarkdown('**')"><b>B</b></el-button>
              <el-button size="small" @click="insertMarkdown('*')"><i>I</i></el-button>
              <el-button size="small" @click="insertMarkdown('~~')"><s>S</s></el-button>
              <el-button size="small" @click="insertMarkdown('---')">—</el-button>
              <el-button size="small" @click="insertMarkdown('`')"><code>{}</code></el-button>
              <el-button size="small" @click="insertMarkdown('```')">{}</el-button>
              <el-button size="small" @click="insertMarkdown('> ')">></el-button>
              <el-button size="small" @click="insertMarkdown('- ')">•</el-button>
              <el-button size="small" @click="insertMarkdown('1. ')">1.</el-button>
              <el-button size="small" @click="insertMarkdown('[](url)')">链</el-button>
              <el-button size="small" @click="insertMarkdown('![alt](url)')">图</el-button>
              <el-button size="small" @click="insertMarkdown('| | |\n| --- | --- |\n| | |')">表</el-button>
              <el-button size="small" @click="insertMarkdown('[toc]')">目录</el-button>
              <el-button size="small" @click="togglePreview">预览</el-button>
            </div>
            
            <!-- 编辑区域 -->
            <div class="editor-content">
              <el-input
                v-model="form.content"
                type="textarea"
                :rows="20"
                placeholder="根据路由动态生成的 Menu 菜单" 
                class="markdown-textarea"
              />
              
              <!-- 预览区域 -->
              <div v-if="showPreview" class="preview-content">
                <div v-html="renderMarkdown(form.content)"></div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = ref({
  title: '',
  content: ''
})
const editorMode = ref('markdown')
const showPreview = ref(false)

const insertMarkdown = (text) => {
  const textarea = document.querySelector('.markdown-textarea')
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const newValue = textarea.value.substring(0, start) + text + textarea.value.substring(end)
    form.value.content = newValue
    
    // 重新聚焦并设置光标位置
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length / 2, start + text.length / 2)
    }, 0)
  }
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

const renderMarkdown = (text) => {
  // 简单的 Markdown 渲染实现
  if (!text) return ''
  
  // 替换标题
  text = text.replace(/^(#+)\s(.*$)/gm, (match, hashes, content) => {
    const level = hashes.length
    return `<h${Math.min(level, 6)}>${content}</h${Math.min(level, 6)}>`
  })
  
  // 替换加粗
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // 替换斜体
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  // 替换删除线
  text = text.replace(/~~(.*?)~~/g, '<del>$1</del>')
  
  // 替换代码块
  text = text.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
  
  // 替换行内代码
  text = text.replace(/`(.*?)`/g, '<code>$1</code>')
  
  // 替换引用
  text = text.replace(/^>\s(.*$)/gm, '<blockquote>$1</blockquote>')
  
  // 替换无序列表
  text = text.replace(/^-\s(.*$)/gm, '<li>$1</li>')
  text = text.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
  
  // 替换有序列表
  text = text.replace(/^\d+\.\s(.*$)/gm, '<li>$1</li>')
  text = text.replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>')
  
  // 替换链接
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
  
  // 替换图片
  text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
  
  // 替换表格
  text = text.replace(/\|(.*?)\|\n\|(.*?)\|\n((?:\|.*?\|\n)*)/gs, (match, header, separator, rows) => {
    const headers = header.split('|').map(h => h.trim()).filter(h => h)
    const rowsArray = rows.split('\n').map(row => row.split('|').map(cell => cell.trim()).filter(cell => cell)).filter(row => row.length)
    
    let table = '<table><thead><tr>'
    headers.forEach(header => table += `<th>${header}</th>`)
    table += '</tr></thead><tbody>'
    rowsArray.forEach(row => {
      table += '<tr>'
      row.forEach(cell => table += `<td>${cell}</td>`)
      table += '</tr>'
    })
    table += '</tbody></table>'
    return table
  })
  
  // 替换换行
  text = text.replace(/\n/g, '<br>')
  
  return text
}

const handleSubmit = () => {
  if (!form.value.title) {
    ElMessage.error('请输入文章标题')
    return
  }
  if (!form.value.content) {
    ElMessage.error('请输入文章内容')
    return
  }
  
  try {
    // 从本地存储读取现有文章
    const storedArticles = localStorage.getItem('articles')
    const articlesArray = storedArticles ? JSON.parse(storedArticles) : []
    
    // 创建新文章对象
    const newArticle = {
      id: Date.now().toString(), // 使用时间戳作为唯一ID
      ...form.value,
      createdAt: new Date().toISOString()
    }
    
    // 添加新文章到数组
    articlesArray.push(newArticle)
    
    // 保存到本地存储
    localStorage.setItem('articles', JSON.stringify(articlesArray))
    
    ElMessage.success('文章添加成功')
    router.push('/article/list')
  } catch (error) {
    ElMessage.error('文章添加失败')
    console.error('Error creating article:', error)
  }
}

const handleCancel = () => {
  router.push('/article/list')
}
</script>

<style scoped>
.article-create {
  padding: 20px;
}

.article-tabs {
  margin-bottom: 20px;
}

.article-tabs .el-breadcrumb {
  font-size: 14px;
}

.article-tabs .el-breadcrumb .active {
  color: #409eff;
  font-weight: bold;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-container {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.editor-mode {
  display: flex;
  border-bottom: 1px solid #e4e7ed;
  background-color: #f5f7fa;
}

.editor-mode .el-button {
  border-radius: 0;
  border: none;
  border-right: 1px solid #e4e7ed;
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fafafa;
  gap: 8px;
}

.editor-toolbar .el-button {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.editor-content {
  position: relative;
}

.markdown-textarea {
  border: none;
  resize: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  width: 100%;
  min-height: 400px;
  padding: 16px;
  box-sizing: border-box;
}

.markdown-textarea:focus {
  outline: none;
}

.preview-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  overflow-y: auto;
  z-index: 10;
}

.preview-content h1, .preview-content h2, .preview-content h3, .preview-content h4, .preview-content h5, .preview-content h6 {
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: 600;
}

.preview-content p {
  margin-bottom: 16px;
  line-height: 1.6;
}

.preview-content code {
  background-color: #f5f7fa;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}

.preview-content pre {
  background-color: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.preview-content pre code {
  background-color: transparent;
  padding: 0;
}

.preview-content blockquote {
  border-left: 4px solid #409eff;
  padding-left: 16px;
  margin: 16px 0;
  color: #606266;
}

.preview-content ul, .preview-content ol {
  margin: 16px 0;
  padding-left: 24px;
}

.preview-content li {
  margin-bottom: 8px;
}

.preview-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.preview-content th, .preview-content td {
  padding: 8px 12px;
  border: 1px solid #e4e7ed;
  text-align: left;
}

.preview-content th {
  background-color: #f5f7fa;
  font-weight: 600;
}

.preview-content img {
  max-width: 100%;
  height: auto;
  margin: 16px 0;
}

.preview-content a {
  color: #409eff;
  text-decoration: none;
}

.preview-content a:hover {
  text-decoration: underline;
}
</style>
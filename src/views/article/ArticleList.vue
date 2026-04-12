<template>
  <div class="article-list">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ $t('article.list.title') }}</span>
          <el-button type="primary" @click="handleCreate">{{ $t('article.list.create') }}</el-button>
        </div>
      </template>
      <el-table :data="articles" style="width: 100%">
        <el-table-column prop="title" :label="$t('article.list.title')" width="300" />
        <el-table-column prop="createdAt" :label="$t('article.list.createdAt')" width="180" />
        <el-table-column :label="$t('article.list.actions')" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">{{ $t('article.list.edit') }}</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">{{ $t('article.list.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-if="total > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const articles = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const fetchArticles = () => {
  try {
    // 从本地存储读取数据
    const storedArticles = localStorage.getItem('articles')
    if (storedArticles) {
      articles.value = JSON.parse(storedArticles)
      total.value = articles.value.length
    } else {
      articles.value = []
      total.value = 0
    }
  } catch (error) {
    ElMessage.error('获取文章列表失败')
    console.error('Error fetching articles:', error)
  }
}

const handleCreate = () => {
  router.push('/article/create')
}

const handleEdit = (row) => {
  // 由于我们没有实现编辑页面，这里暂时跳转到列表页
  router.push('/article/list')
}

const handleDelete = (id) => {
  try {
    // 从本地存储删除数据
    const storedArticles = localStorage.getItem('articles')
    if (storedArticles) {
      const articlesArray = JSON.parse(storedArticles)
      const updatedArticles = articlesArray.filter(article => article.id !== id)
      localStorage.setItem('articles', JSON.stringify(updatedArticles))
      ElMessage.success('删除文章成功')
      fetchArticles()
    }
  } catch (error) {
    ElMessage.error('删除文章失败')
    console.error('Error deleting article:', error)
  }
}

const handleSizeChange = (size) => {
  pageSize.value = size
  fetchArticles()
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  fetchArticles()
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.article-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
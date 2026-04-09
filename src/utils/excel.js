import * as XLSX from 'xlsx'

/**
 * 导入Excel文件并解析为JSON数据
 * @param {File} file - Excel文件对象
 * @returns {Promise<Array>} 解析后的数据数组
 */
export const importExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsBinaryString(file)
  })
}

/**
 * 导出JSON数据为Excel文件
 * @param {Array} data - 要导出的数据数组
 * @param {string} fileName - 导出的文件名
 * @param {Array} headers - 表头配置，格式为[{key: 'field', title: '标题'}]
 */
export const exportExcel = (data, fileName = 'export.xlsx', headers = []) => {
  let worksheet
  if (headers.length > 0) {
    // 转换数据格式以匹配表头
    const formattedData = data.map(item => {
      const formattedItem = {}
      headers.forEach(header => {
        formattedItem[header.title] = item[header.key]
      })
      return formattedItem
    })
    worksheet = XLSX.utils.json_to_sheet(formattedData)
  } else {
    worksheet = XLSX.utils.json_to_sheet(data)
  }
  
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, fileName)
}

import Vue from 'vue'
const vm = new Vue()
const confirm = async (delMsg, delTitle) => {
    const confirmResult = await vm.$confirm(delMsg, delTitle, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
  }).catch(err => err)
  return confirmResult
}
export default confirm

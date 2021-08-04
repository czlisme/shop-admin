<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" >
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
               <el-row :gutter="10">
                   <el-col :span="16">
                        <el-input placeholder="请输入内容" clearable v-model="queryInfo.query"  @keyup.enter.native="getUserList" @clear="getUserList">
                            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                        </el-input>
                   </el-col>
                   <el-col :span="4">
                       <el-button type="primary"  @click="dialogFormVisible = true">添加用户</el-button>
                   </el-col>
               </el-row>
               <!-- 用户列表区域 -->
               <el-table stripe :data="userList" border highlight-current-row style="width: 100%" height="450px">
                   <el-table-column  type="index" label="#"></el-table-column>
                   <el-table-column prop="username" label="姓名" width="80"></el-table-column>
                   <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
                   <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
                   <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
                   <el-table-column prop="mg_state" label="状态" width="180">
                    <!-- 作用域插槽 渲染switch显示状态 -->
                        <template slot-scope="scope">
                             <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                        </template>
                   </el-table-column>
                   <el-table-column  label="操作" width="180">
                       <template slot-scope="scope">
                           <!-- 修改按钮 -->
                            <el-button type="primary" icon="el-icon-edit" circle  @click="showEditDialog(scope.row.id)"></el-button>
                            <!-- 删除按钮 -->
                            <el-tooltip effect="dark" content="删除用户" placement="top">
                                <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row.id)"></el-button>
                            </el-tooltip>
                            <!-- 分配权限按钮 -->
                            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                                <el-button type="warning" icon="el-icon-star-off" circle></el-button>
                            </el-tooltip>
                       </template>
                   </el-table-column>
               </el-table>
               <!-- 分页组件 -->
                 <div class="block" >
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 3, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
                </div>
                <!-- 添加用户弹出层 -->
                <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="addDialogClose" width="70%">
                    <el-form label-width="80px" :model="addForm" ref="addFormRef" :rules="rules">
                        <el-form-item label="用户名"  prop="username" >
                            <el-input v-model="addForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop='password'>
                             <el-input  v-model="addForm.password" ></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop ='email'>
                             <el-input  v-model="addForm.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop='mobile' >
                             <el-input  v-model="addForm.mobile"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button round @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="danger" round @click="resetAddForm">重置</el-button>
                        <el-button type="primary" round @click="addUser">确 定</el-button>
                    </div>
                </el-dialog>
                <!-- 修改用户弹出层 -->
                <el-dialog title="修改用户" :visible.sync="editUserVisible" width="70%">
                    <el-form label-width="80px" :model="editForm" ref="editFormRef" :rules="rules">
                        <el-form-item label="用户名"  prop="username"  >
                            <el-input v-model="editForm.username" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱"  prop="email"  >
                            <el-input v-model="editForm.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机"  prop="mobile"  >
                            <el-input v-model="editForm.mobile"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="info" round @click="editUserVisible = false">取消</el-button>
                        <el-button type="primary" round @click="editUser" >确认</el-button>
                    </div>
                </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        // 自定义验证密码函数
        const validatePass = (rule, value, callback) => {
            if (value.trim() === '' && value.length === 0){
                console.log(rule)
                callback(new Error('请输入密码'))
            } else {
                // 正则规则 密码必须为最少6位 最多16位
                // 密码中必须包含字母、数字、特称字符
               const regx = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}')
               if ( !regx.test(value)){
                   callback(new Error('密码中必须包含字母、数字、特称字符'))
               } else {
                   callback()
               }
            }
        }
        // 自定义验证邮箱函数
        const validateEmail = (rule, value, callback) => {
            //以数字字母开头 中间可以是多个数字字母下划线或 -
            // 然后是@ 后面是数字字母然后是" . "符号加2-4个字母结尾
            const regx = new RegExp('^([\\da-zA-Z])(\\w|\\-)+@[\\da-zA-Z]+\\.([a-zA-Z]{2,4})$')
            if (value.trim() === ''){
                callback()
            } else if (!regx.test(value)){
                callback(new Error('邮箱格式不符合要求'))
            } else {
                callback()
            }
        }
        // 自定义验证手机号函数
        const validateMobile = (rule, value, callback) => {
            const regx = new RegExp('^(0|\\+?86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$')
            if (!regx.test(value)) {
                callback(new Error('请输入正确的手机号'))
            } else {
                callback()
            }
        }
        return {
            queryInfo:{
                //query关键字搜索
                query:'',
                pagenum:1,
                pagesize:5
            },
              addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            editForm:{
            },
            userList:[],
            total:0,
            dialogFormVisible: false,
            editUserVisible:false,
            formLabelWidth:'120px',
            rules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
                    ],
                password: [
                    { required: true },
                    { validator: validatePass, trigger: 'blur' }
                ],
                email: [
                    { validator: validateEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required:true, message: '请输入手机号', trigger: 'blur' },
                    { validator: validateMobile, trigger: 'blur' }
                ]
            },
        }
    },
    created() {
        // 生命周期函数 渲染页面时调用用户列表数据
        this.getUserList()
    },
    methods: {
        // 获取用户列表数据功能
        async getUserList(){
          const { data: res } = await this.$http.get('users', {
              params:this.queryInfo
           })
           if (res.meta.status !== 200 ){
                return this.$message.error(res.meta.msg)
            }
            this.userList = res.data.users
            this.total = res.data.total
        },
        // 改变分页数据大小功能
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        //实现改变页
        handleCurrentChange(currentPage){
            this.queryInfo.pagenum = currentPage
            this.getUserList()
        },
        // 监听用户状态开关的变化 element ui 组件中的change事件
        async userStateChanged(userInfo){
            console.log(userInfo)
           await this.$http.put(`users/:${userInfo.id}/state/:${userInfo.type}`)
            console.log(userInfo)
        },
        // 重置表单
        resetAddForm(){
            this.$refs.addFormRef.resetFields()
        },
        // 添加用户每一次打开dialog都重置表单数据功能
        addDialogClose(){
             this.$refs.addFormRef.resetFields()
        },
        // 添加用户信息功能
         addUser(){
             console.log(this.$refs)
             this.$refs.addFormRef.validate( async valid => {
                 //回调函数接收 js前端预校验结果返回布尔值
                 if (!valid) return false
                //发起网络请求
              const { data:res } = await this.$http.post('users', this.addForm)
              if (res.meta.status !== 201){
                  return this.$message.error(res.meta.msg)
              }
                  this.$message.success(res.meta.msg)
                  this.dialogFormVisible = false
                  this.getUserList()
             })
        },
        //编辑用户信息展示功能
        async showEditDialog(id){
            // 通过id查询信息
            this.editUserVisible = true
            const { data:res } = await this.$http.get(`users/${id}`)
            if (res.meta.status !== 200 ){
               return this.$message.error('查询用户数据失败')
            }
            this.editForm = res.data
        },
        // 删除用户功能
       deleteUser(id){
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then( async () => {
                const { data: res } = await this.$http.delete(`users/${id}`)
                if (res.meta.status !== 200) {
                    this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.getUserList()
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })
            })
        },
        async editUser(){
            const id = this.editForm.id
            const { data:res } = await this.$http.put(`users/${id}`, this.editForm)
            if (res.meta.status !== 200) {
                console.log(res)
                return this.$message.error('用户信息修改失败')
            }
            this.editUserVisible = false
            this.$message.success(res.meta.msg)
            console.log(this.editForm)
             this.getUserList()
        }
    },
}
</script>
<style lang="less" scoped>
.el-card{
    .block{
        overflow-x: auto !important;
        }
    .dialog-footer{
            margin-top: -30px !important;
            display: flex !important;
            justify-content:space-evenly !important;
    }
}
</style>

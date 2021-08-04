<template>
    <div style="width:100%">
           <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" >
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card" style="min-width:625px">
            <el-button type="primary" @click="roleDialogVisible = true; addRoleBtn ='添加角色' ">添加角色</el-button>
            <!-- 角色列表区域 -->
            <el-table
                :data="rolesData"
                highlight-current-row
                border
                stripe
                >
                 <el-table-column prop="prop" width="30" type="expand">
                  <template slot-scope="scope">
                      <el-row :gutter="10" :class="['rightlevel']">
                          <el-col :span="6">
                              <span>一级权限</span>
                          </el-col>
                          <el-col :span="18">
                              <el-row>
                                  <el-col :span="8"><span>二级权限</span></el-col>
                                  <el-col :span="16"><span>三级权限</span></el-col>
                              </el-row>
                          </el-col>
                      </el-row>
                      <!-- 一级权限渲染 -->
                      <el-row :class="['bd_bottom','vcenter',i1 === '0' ? 'bd_top' : '']" :gutter="10" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                          <el-col :span="6">
                              <el-tag  effect="dark" :closable="tagClosable" @close="removeRight(scope.row,item1.id)">{{item1.authName}}</el-tag>
                              <i class="el-icon-caret-right"></i>
                          </el-col>
                          <el-col :span="18">
                              <!-- 二级权限渲染 -->
                              <el-row v-for="(item2,i2) in item1.children" :class="['vcenter',i2 === '0' ? '' : 'bd_top']" :key="item2.id">
                                  <el-col :span="8">
                                      <el-tag  effect="dark" type="success" closable @close="removeRight(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                     <i class="el-icon-caret-right"></i>
                                  </el-col>
                                     <!-- 三级权限渲染 -->
                                  <el-col :span="16">
                                    <el-tag effect="dark" type="danger" closable @close="removeRight(scope.row,item3.id)" v-for="(item3,i3) in item2.children" :class="[i3 === '0' ? '' : 'bd_top']" :key="item3.id">{{item3.authName}}</el-tag>
                                  </el-col>
                              </el-row>
                          </el-col>
                      </el-row>
                  </template>
                </el-table-column>
                <el-table-column
                    type="index"
                    label="#"
                    width='30'
                   >
                </el-table-column>
                <el-table-column
                    prop="roleName"
                    label="角色名称"
                   >
                </el-table-column>
                <el-table-column
                    prop="roleDesc"
                    label="角色描述"
                    >
                </el-table-column>
                <el-table-column  class="table_col_btn" label="操作"  width="320">
                            <template slot-scope="scope">
                           <!-- 修改按钮 -->
                            <el-button type="primary" icon="el-icon-edit" @click="editRoleDialogVisible(scope.row.id)" >编辑</el-button>
                            <!-- 删除按钮 -->
                            <el-tooltip effect="dark" content="删除角色" placement="top">
                                <el-button type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
                            </el-tooltip>
                            <!-- 分配权限按钮 -->
                            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                                <el-button type="warning" icon="el-icon-star-off" @click="showRightDialog(scope.row)">分配权限</el-button>
                            </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--添加角色 修改角色弹出层 -->
            <el-dialog
                    :title="addRoleBtn"
                    :visible.sync="roleDialogVisible"
                    width="70%"
                    @close="roleDialogReset"
                    >
                        <el-form :model="addRoleData" ref="addRoleDataRef" :rules="rules" label-width="80px">
                            <el-form-item label="角色名称" prop='roleName'>
                                <el-input v-model="addRoleData.roleName"></el-input>
                            </el-form-item>
                            <el-form-item label="角色描述" prop='roleDesc'>
                                <el-input v-model="addRoleData.roleDesc"></el-input>
                            </el-form-item>
                        </el-form>
                    <div slot="footer">
                        <el-button @click="roleDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addRole" v-if="addRoleBtn === '添加角色'">确 定</el-button>
                        <el-button type="primary" @click="editRole(addRoleData.roleId)" v-else>确 定</el-button>
                    </div>
            </el-dialog>
            <!-- 分配权限弹出层 -->
            <el-dialog title="分配权限" :visible.sync="rightDialogVisible" width="50%" @close="resetDefKeys">
                <!-- 树形控件 -->
                <el-tree ref="treeRef" :data="rightList" :props="treeProps" show-checkbox default-expand-all :default-checked-keys='defKeys' node-key="id" >
                </el-tree>
                <div slot="footer">
                    <el-button @click="rightDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="allotRights">确 定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            rolesData:[],
            roleDialogVisible:false,
            rightDialogVisible:false,
            tagClosable:true,
            handleClose:false,
            addRoleBtn:'添加角色',
            addRoleData:{
                roleName:'',
                roleDesc:'',
                // roleId:''
            },
            rules:{
                roleName:[
                    { required: true, message:'请输入用户角色', trigger: 'blur' }
                ],
                roleDesc:[
                    { required:true, message:'请输入角色描述', trigger: 'blur' }
                ]
            },
            rightList:[],
            treeProps:{
                label:'authName',
                children:'children',
            },
            defKeys:[],
            // 即将要分配权限角色的id
            roleId:''
        }
    },
    created() {
       this.getRolesList()
    },
    methods: {
        // 获取角色列表功能
        getRolesList(){
            this.$http.get('roles').then((result) => {
            const { data: res } = result
            if (res.meta.status !== 200 ){
               return this.$message.error(res.meta.msg)
            }
            this.rolesData = res.data
             })
        },
        // 添加角色功能
        addRole(){
            this.$refs.addRoleDataRef.validate( async valid => {
                 //回调函数接收 js前端预校验结果返回布尔值
                 if (!valid) return false
                //发起网络请求
              const { data:res } = await this.$http.post('roles', this.addRoleData)
              if ( res.meta.status !== 201){
                  return this.$message.error(res.meta.msg)
              }
                this.roleDialogVisible = false
                  this.$message.success(res.meta.msg)
                  this.getRolesList()
             })
        },
        // 添加角色表单重置功能
        roleDialogReset(){
              this.$refs.addRoleDataRef.resetFields()
        },
        //封装删除权限是个异步函数 需要await或promise拿到结果
        //删除角色弹出提出用户确认层confirm函数
        async confirm(delMsg, delTitle){
            const confirmResult = await this.$confirm(delMsg, delTitle, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).catch(err => err)
          return confirmResult
        },
        async removeRight(role, rightId){
            if (await this.confirm('你确定为该角色永久删除改权限吗?', '删除角色权限') !== 'confirm'){
                return this.$message.info('已取消删除权限')
            }
            const { data:res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            console.log(res)
            role.children = res.data
        },
        // 修改角色弹出层 接收一个角色id并发送请求将数据显示在表单中
        // 注意: 添加角色和修改角色功能共用一个弹出层 以做判断
        async editRoleDialogVisible(roleId){
            this.addRoleBtn = '修改角色'
            const { data:res } = await this.$http.get(`roles/${roleId}`)
            this.addRoleData = res.data
            this.roleDialogVisible = true
        },
        // 当点击修改角色弹出层确定时 向接口发送请求修改并重新渲染角色列表
        async editRole(id) {
            const { data:result } = await this.$http.put(`roles/${id}`, this.addRoleData)
            if (result.meta.status !== 200 ) {
              return this.$message.error('角色信息修改失败')
            }
            this.roleDialogVisible = false
            this.$message.success('角色信息修改成功')
            this.getRolesList()
        },
        // 通过角色id删除角色功能
        async deleteRole(roleId){
             if (await this.confirm('你确定永久删除该角色吗', '删除角色') !== 'confirm'){
                return this.$message.info('已取消删除角色')
            }
            const { data:res } = await this.$http.delete(`roles/${roleId}`)
            this.$message.success(res.meta.msg)
            this.getRolesList()
        },
        //分配权限弹出层控制
        async showRightDialog(role){
            this.roleId = role.id
            const { data:res } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200 ){
                return this.$message.error(res.meta.msg)
            }
            this.rightList = res.data
            this.getLesfKeys(role, this.defKeys)
            console.log(this.defKeys)
            this.rightDialogVisible = true
        },
        //通过递归的形式 获取所有三级权限下的id 并保存在defKeys数组中
        getLesfKeys(node, arr){
            //如果当前节点不包含 children属性 则是三级节点
            if ( !node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                  this.getLesfKeys(item, arr)
            })
        },
        //关闭时重置
        resetDefKeys(){
            this.defKeys = []
        },
        async allotRights(){
            const Keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const idStr = Keys.join(',')
            const { data:res } = await this.$http.post(`roles/${this.roleId}/rights`, {
                rids:idStr
            })
            if (res.meta.status !== 200){
                return this.$message.error('角色权限分配失败')
            }
            this.$message.success('角色权限分配权限成功')
            this.rightDialogVisible = false
            this.getRolesList()
        }
    },
}
</script>
<style lang="less" scoped>
    .table_col_btn{
        display: flex;
        justify-content: left;
        overflow-x: auto;
    }
    .el-table{
        overflow-x: auto;
        .el-button{
         font-size: 6px;
        padding: 6px 20px;
        }
    }
    .el-tag{
        margin:7px;
    }
    .bd_top{
        border-top: 1px solid #eee;
    }
    .bd_bottom{
        border: 1px solid #eee;
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
    .rightlevel{
        text-align: center;
        font-weight: bold;
        padding-bottom: 8px;
    }
</style>

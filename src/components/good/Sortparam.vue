<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-ico-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div slot="header" class="card_header">
                <el-alert
                    title="注意：只允许为第三级分类设置相关参数！"
                    type="warning"
                    :closable="false"
                    show-icon>
                </el-alert>
                <el-row class="cat_opt">
                    <el-col>
                        <span>请先选择商品分类:</span>
                        <el-cascader
                        :options="cateList"
                        v-model="cateKeys"
                        @change="cateSelectChange"
                        :props="cateProps"
                        clearable>
                        </el-cascader>
                    </el-col>
                </el-row>
            </div>
            <!-- 卡片body -->
            <div>
                <el-row>
                    <el-tabs type="border-card" v-model="activeName"  @tab-click="handleClick" style="overflow-x:auto">
                        <el-tab-pane label="动态参数" name="many">
                            <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showAddDialog = true">添加参数</el-button>
                            <el-table
                                :data="manyParamsList" height="310"
                                 border  highlight-current-row stripe>
                                <el-table-column type="expand">
                                    <template slot-scope="scope">
                                        <el-tag type="success" @close="handleClose(index, scope.row)" closable v-for="(item, index) in scope.row.attr_vals" :key="index">
                                            {{item}}
                                        </el-tag>
                                         <el-input
                                            class="input-new-tag"
                                            v-if="scope.row.inputVisible"
                                            v-model="scope.row.inputValue"
                                            ref="saveTagInput"
                                            size="small"
                                            @keyup.enter.native="handleInputConfirm(scope.row)"
                                            @blur="handleInputConfirm(scope.row)"
                                            >
                                        </el-input>
                                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="#"
                                    type="index"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="attr_name"
                                    label="参数名称"
                                    >
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    width="180px"
                                    >
                                    <template slot-scope="scope">
                                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="getParamName(scope.row.attr_id)">编辑</el-button>
                                    <el-button type="danger" size="mini" icon="el-icon-delete"  @click="removeParams(scope.row.attr_id)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="静态属性" name="only">
                            <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showAddDialog = true">添加属性</el-button>
                                <el-table
                                :data="onlyParamsList"
                                border  highlight-current-row stripe>
                                <el-table-column type="expand">
                                    <template slot-scope="scope">
                                        <el-tag type="success" @close="handleClose(index, scope.row)" closable v-for="(item, index) in scope.row.attr_vals" :key="index">
                                            {{item}}
                                        </el-tag>
                                         <el-input
                                            class="input-new-tag"
                                            v-if="scope.row.inputVisible"
                                            v-model="scope.row.inputValue"
                                            ref="saveTagInput"
                                            size="small"
                                            @keyup.enter.native="handleInputConfirm(scope.row)"
                                            @blur="handleInputConfirm(scope.row)"
                                            >
                                        </el-input>
                                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="#"
                                    type="index"
                                    width="30">
                                </el-table-column>
                                <el-table-column
                                    prop="attr_name"
                                    label="参数名称"
                                    >
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    width="180"
                                    >
                                   <template slot-scope="scope">
                                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="getParamName(scope.row.attr_id)">编辑</el-button>
                                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                                   </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>

                    </el-tabs>
                </el-row>
            </div>
        </el-card>
        <!-- 添加对话框 -->
        <el-dialog
            @close='closeDialog'
            :title=" '添加' + textTitle"
            :visible.sync="showAddDialog"
            width="60%"
            >
            <div>
                <el-form :model="addForm" ref="addFormRef" :rules="rules" >
                    <el-form-item :label="textTitle" prop="attr_name">
                        <el-input v-model="addForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button @click="showAddDialog = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑对话框 -->
        <el-dialog
            @close='closeEditDialog'
            :title=" '修改' + textTitle"
            :visible.sync="showEditDialog"
            width="60%"
            >
            <div>
                <el-form :model="editForm" ref="editFormRef" :rules="rules" >
                    <el-form-item :label="textTitle" prop="attr_name">
                        <el-input v-model="editForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button @click="showEditDialog = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import confirm from '../../assets/js/confirm'
export default {
    data() {
        return {
            // 商品列表
            cateList:[],
            // 级联选择器配置
            cateProps:{
                expandTrigger:'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // 级联选择器选中后的数组 [cat_id]
            cateKeys:[],
            // tabs默认选中 only many
            activeName:'many',
            // 动态参数列表
            manyParamsList:[],
            // 静态参数列表
            onlyParamsList:[],
            showAddDialog:false,
            addForm:{
                attr_name:''
            },
            rules:{
                    attr_name:[
                        { required:true, message:'请输入参数名称', trigger:'blur' }
                    ]
            },
            showEditDialog:false,
            editForm:{},
            dynamicTags:[]
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取商品数据列表请求
        async getCateList(){
            const { data:res } = await this.$http.get('categories')
            this.cateList = res.data
            // console.log(res.data)
            if (res.meta.status !== 200 ){
                return this.$message.error('获取商品分类列表数据失败')
            }
        },
        // 级联选择器选中改变时触发
        cateSelectChange(){
            this.getParamsData()
        },
        // 获取参数列表数据
        async getParamsData(){
            if (this.cateKeys.length !== 3 ){
                this.cateKeys = []
                this.manyParamsList = []
                this.onlyParamsList = []
                return this.$message.warning('只允许为第三级分类设置参数')
            }
            console.log(this.cateKeys)
            // 选中后三级分类商品发送请求
            const { data:res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                params:{
                    sel:this.activeName
                }
            })
            if (res.meta.status !== 200 ) {
                return this.$message.error('获取商品参数失败')
            }
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                item.inputVisible = false
                item.inputValue = ''
            })
            console.log(res.data)
            if (this.activeName === 'many') {
                    this.manyParamsList = res.data
            } else {
                    this.onlyParamsList = res.data
            }
        },
        // tabs点击后触发
        handleClick(){
            this.getParamsData()
            console.log(this.activeName)
        },
        // 监听对话框关闭事件
        closeDialog(){
            this.$refs.addFormRef.resetFields()
        },
        closeEditDialog(){
            this.$refs.editFormRef.resetFields()
        },
        // 添加参数
        addParams(){
            this.$refs.addFormRef.validate( async vaild => {
                if (!vaild) return
                const { data:res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                })
                if (res.meta.status !== 201 ) {
                    return this.$message.error(res.meta.msg)
                }
                this.showAddDialog = false
                this.$message.success(res.meta.msg)
                this.getParamsData()
            })
        },
        //点击编辑后查询参数名称并填到表单参数名称中
        async getParamName(id){
                const { data:res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`)
                if (res.meta.status !== 200 ) {
                    return this.$message.error(res.meta.msg)
                }
                this.editForm = res.data
                this.showEditDialog = true
        },
        // 点击确定后修改参数名称
        editParams(){
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                const { data:res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                    attr_name:this.editForm.attr_name,
                    attr_sel:this.activeName
                })
                if (res.meta.status !== 200 ) {
                    return this.$message.error('更新参数名称失败')
                }
                this.getParamsData()
                this.showEditDialog = false
            })
        },
        async removeParams(id){
            if (await confirm(`你确定要删除该${this.textTitle}吗?`, `删除${this.textTitle}`) !== 'confirm') {
                return this.$message.info(`已取消删除${this.textTitle}`)
            }
            const { data:res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getParamsData()
        },
        //动态标签
        showInput(row) {
        row.inputVisible = true
        //$nextTick()当页面上的元素被重新渲染之后才调用回调函数之中的代码
        // 如果不调用的话只是更改了布尔值 inupt元素还未渲染
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
        },
      async handleInputConfirm(row) {
        if (row.inputValue.trim().length === 0) {
            row.inputVisible = false
            row.inputValue = ''
            return
        }
        // 如果没有 return 则证明输入内容需要做处理
        console.log(row)
        row.attr_vals.push(row.inputValue.trim())
        row.inputVisible = false
        row.inputValue = ''
        // 删除对应的参数和选项
        this.saveAttrVals(row)
        },
        handleClose(index, row) {
          row.attr_vals.splice(index, 1)
          this.saveAttrVals(row)
        },
        async saveAttrVals(row){
                    // 向数据库添加发起请求
        const { data:res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
            attr_name:row.attr_name,
            attr_sel:row.attr_sel,
            attr_vals:row.attr_vals.join(',')
        })
        console.log(res)
        if (res.meta.status !== 200) {
            return this.$message.error('修改参数项失败!')
        }
         this.$message.success('修改参数项成功')
      }
    },
        // 计算属性 控制按钮禁用与否 和 请求参数商品id
    computed:{
        isBtnDisabled(){
            if (this.cateKeys.length !== 3 ){
                return true
            } else {
                return false
            }
        },
        // 当前选中的三级分类Id
        cateId() {
            if (this.cateKeys.length === 3 ){
                return this.cateKeys[2]
            }
            return null
        },
        textTitle(){
            if (this.activeName === 'many') {
                return '动态参数'
            } else {
                return '静态属性'
            }
        }
    }

}
</script>
<style lang="less" scoped>
    .card_header{
            margin-bottom: -10px;
            .cat_opt{
                span{
                    font-weight: normal;
                    margin-right: 15px;
                }
             margin: 15px 0;
        }
    }
    .el-tag{
        margin-top: 8px;
        margin-right: 15px;
    }
    .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
    }
    .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
    .el-cascader{
        width: 300px;
    }
</style>

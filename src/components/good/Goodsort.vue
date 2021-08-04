<template>
    <div>
        <el-breadcrumb  separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-button type="primary" @click="showAddSort">添加分类</el-button>
            <!-- 商品分类列表 -->
            <el-table size="mini" :data="goodCategories" highlight-current-row  height="400" border stripe lazy row-key="cat_id" :indent=20
    :tree-props="{children: 'children', hasChildren: 'haschildren'}">
                <el-table-column
                    label="#"
                    type='index'
                    >
                    <template slot-scope="scope">
                    <span>{{scope.row.cat_level === 0 ? goodCategories.indexOf(scope.row)+ 1 : ''}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="分类名称"
                    prop="cat_name"
                    >
                </el-table-column>
                <el-table-column
                    label="是否有效"
                    >
                    <template slot-scope="scope">
                        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" ></i>
                        <i class="el-icon-error" v-else></i>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cat_level"
                    label="排序"
                    >
                    <template slot-scope="scope">
                    <el-tag  v-if="scope.row.cat_level === 0" effect="dark">一级</el-tag>
                    <el-tag  v-else-if="scope.row.cat_level === 1" effect="dark" type="success">二级</el-tag>
                    <el-tag  v-else effect="dark" type="danger">三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="250px"
                    >
                      <template slot-scope="scope">
                            <el-button icon="el-icon-edit" type="primary" @click="showEditDialog(scope.row.cat_id)" size='mini'>编辑</el-button>
                            <el-button icon="el-icon-delete" type="danger" @click="deleteCate(scope.row.cat_id)" size='mini'>删除</el-button>
                      </template>
                </el-table-column>
            </el-table>
            <!-- 分页功能 -->
            <div class="block">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 5, 10, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="5"
        :total="total">
        </el-pagination>
            </div>
        </el-card>
        <!-- 编辑商品分类弹出层 -->
        <el-dialog
            title="修改分类"
            :visible.sync="sortDialogVisible"
            width="50%"
           >
            <div>
                <el-form :model="cat_data" label-width="80px" :rules="rules" ref="cat_data" >
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="cat_data.cat_name" ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button @click="sortDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCate">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加分类弹出层 -->
        <el-dialog
            title=""
            :visible.sync="addSortdialog"
            width="50%"
            @close="resetAddSortDialog"
            >
            <el-form :model="addCateForm" :rules="rules" ref="addCateFormRef">
                <el-form-item label="分类名称" label-width="80" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类" label-width="80">
                    <!-- <el-input v-model="addCateForm.parent_cata_name"></el-input> -->
                <!-- 级联选择器 -->
                <el-cascader v-model="selectKeys" ref="cascader" @change="parentCateChanged"  clearable  :options="parentCateList" :props="cascaderProps" ></el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="addSortdialog = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import confirm from '../../assets/js/confirm'
export default {
    data() {
        return {
            // 商品数据列表参数
            queryInfo:{
                type:[1, 2, 3],
                pagenum:1,
                pagesize:5,
            },
            // 总条数
            total:0,
            // 数据列序号
            index:1,
            // 当前页
            currentPage:1,
            // 商品数据列表
            goodCategories:[],
            // 添加分类表单数据源
            addCateForm:{
                cat_name:'',
                cat_pid:0,
                cat_level:0
            },
            // 添加分类级联选择器 父级数据源
            parentCateList:[],
            //指定级联选则气的配置对象
            cascaderProps:{
                expandTrigger:'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children',
                checkStrictly:true
            },
            // 级联选择器选中后的输入框的值
            selectKeys:[],
            // 控制编辑分类名称弹出层
            sortDialogVisible:false,
            //添加分类弹出层
            addSortdialog:false,
            //即将要修改的商品id
            cateId:'',
            // 编辑商品数据源
            cat_data:{
                cat_name:'',
                cat_pid:'',
                cat_level:''
            },
            // 分类名称验证规则
            rules:{
               cat_name: [
                { required: true, message:'请输入分类名称', trigger: 'blur' },
                { max:16, message:'分类名称不能超过16个字符', trigger: 'blur' },
                ]
            },
        }
    },
    created() {
        this.getCategoriesList()
    },
    methods: {
        async getCategoriesList(){
            const { data:res } = await this.$http.get('categories', { params: this.queryInfo })
            console.log(res)
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类列表失败')
            }
            this.goodCategories = res.data.result
            this.total = res.data.total
        },
        methodIndex(){
            // console.log(this.goodCategories)
            // console.log(index)
            // console.log(index)
        },
        async showEditDialog(id){
            this.sortDialogVisible = true
            const { data:res } = await this.$http.get(`categories/${id}`)
            this.cat_data = res.data
            this.cateId = id
        },
        async editCate(){
            this.$refs.cat_data.validate( async valid => {
                if (!valid){
                    return false
                }
                const { data:res } = await this.$http.put(`categories/${this.cateId}`, { cat_name:this.cat_data.cat_name })
                if ( res.meta.status === 200 ){
                await this.getCategoriesList()
                this.sortDialogVisible = false
                this.$message.success('商品分类名称更新成功')
                }
            })
        },
        async deleteCate(id) {
           if (await confirm('你确定永久删除该分类商品吗?', '删除商品') !== 'confirm'){
                return this.$message.info('已取消删除权限')
            }
            const { data:res } = await this.$http.delete(`categories/${id}`)
                if ( res.meta.status === 200 ){
                this.sortDialogVisible = false
                this.$message.success('商品删除成功')
                this.getCategoriesList()
                }
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCategoriesList()
        },
        handleCurrentChange(val) {
            this.queryInfo.pagenum = val
            this.getCategoriesList()
        },
        showAddSort(){
            this.addSortdialog = true
            this.getParentCateList()
        },
        async getParentCateList(){
            const { data:res } = await this.$http.get('categories', {
                params:{
                    type:2
                }
            })
            if (res.meta.status !== 200 ) {
                return this.$message.error('获取父级商品数据失败')
            }
            this.parentCateList = res.data
        },
        parentCateChanged(){
            console.log(this.selectKeys)
            // 如果选中的数组长度大于0 则已选中父级id
            //  反之 说明未选中
            if (this.selectKeys.length > 0 ){
                this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
                this.addCateForm.cat_level = this.selectKeys.length
            } else {
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_pid = 0
            }
        },
        async addCate(){
            this.$refs.addCateFormRef.validate( async valid => {
                switch ( valid) {
                    case true:{
                    console.log(this.addCateForm)
                    const { data:res } = await this.$http.post('categories', this.addCateForm)
                    this.addSortdialog = false
                    console.log(res.data)
                    if ( res.meta.status === 201 ) {
                        this.getCategoriesList()
                        this.$message.success('添加分类成功')
                        }
                    }
                        break
                }
            })
        },
        resetAddSortDialog(){
            this.$refs.addCateFormRef.resetFields()
            // this.$refs.parentCateRef.clearCheckedNodes()
            this.$refs.cascader.$refs.panel.clearCheckedNodes()
        }
    //       load(tree, treeNode, resolve) {
    //         setTimeout(() => {
    //         console.log(tree)
    //         resolve(this.goodCategories)
    //         }, 1000)
    // },
    }
}
</script>
<style lang="less" scoped>
.el-table-column{
    height: 50px;
}
.el-cascader{
    width: 100%;
}
.cascader_select{
    height: 300px;
}
</style>

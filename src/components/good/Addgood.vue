<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }"> 首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                title="添加商品信息"
                type="info"
                center
                :closable="false"
                show-icon
                >
            </el-alert>
            <!-- 步骤条 -->
            <el-steps  :active="activeIndex - 0" finish-status="success" simple align-center >
                <el-step title="基本信息" icon="el-icon-edit"></el-step>
                <el-step title="商品参数" icon="el-icon-goods"></el-step>
                <el-step title="商品属性" icon="el-icon-s-goods"></el-step>
                <el-step title="商品图片" icon="el-icon-picture"></el-step>
                <el-step title="商品内容" icon="el-icon-s-goods"></el-step>
                <el-step title="完成" icon="el-icon-success"></el-step>
            </el-steps>
            <!-- tab 栏 -->
            <el-form style="overflow:auto;height:620px" ref="addFormRef" :model="addForm" label-width="80px" label-position="top" :rules="addFormRules">
                <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                          <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                placeholder="请选择分类"
                                clearable
                                :options="cateList"
                                :props="cateProps"
                                v-model="addForm.goods_cat"
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border  :label="cb" :key="i" v-for="(cb, i) in item.attr_vals"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                        :on-success="handleSuccess"
                        :headers="headers"
                        :action="uploadUrl"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        list-type="picture-card">
                          <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器组件 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <!-- 图片预览对话框 -->
            <el-dialog :visible.sync="previewVisible" width="80%">
                <img width="100%" :src="previewPath" alt="">
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeIndex:'0',
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                goods_cat:[],
                pics:[],
                // 商品详情的内容
                goods_introduce:'',
                attrs:[]
            },
            cateList:[],
            // 动态参数列表
            manyTableData:[],
            // 静态属性列表
            onlyTableData:[],
            // 图片上传url
            uploadUrl:'api/api/private/v1/upload',
            cateProps:{
                expandTrigger:'hover',
                label:'cat_name',
                value:'cat_id',
                children:'children'
            },
            // 配置请求头携带token
            headers:{
                Authorization:window.sessionStorage.getItem('token')
            },
            // 预览路径
            previewPath:'',
            previewVisible:false,
            addFormRules:{
                goods_name:[
                    { required:true, message:'请输入商品名称', trigger:'blur' }
                ],
                goods_price:[
                    { required:true, message:'请输入商品价格', trigger:'blur' }
                ],
                goods_weight:[
                    { required:true, message:'请输入商品重量', trigger:'blur' }
                ],
                goods_number:[
                    { required:true, message:'请输入商品数量', trigger:'blur' }
                ],
                goods_cat:[
                    { required:true, message:'请输入商品分类', trigger:'blur' }
                ],
            }
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList(){
            const { data:res } = await this.$http.get('categories')
            this.cateList = res.data
            console.log(res.data)
            if (res.meta.status !== 200 ){
                return this.$message.error('获取商品分类列表数据失败')
            }
        },
        handleChange(){
            if (this.addForm.goods_cat.length !== 3){
                this.addForm.goods_cat = []
                return this.$message.info('只允许为第三级分类添加商品')
            }
            console.log(this.addForm.goods_cat)
        },
        beforeTabLeave(activeName, oldActiveName){
            if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                this.addForm.goods_cat = []
                this.$message.error('请先选择商品分类且必须为三级分类')
                return false
            }
        },
        async tabClicked(){
            if (this.activeIndex === '1') {
            console.log('动态参数面板')
            const { data:res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                params:{
                    sel:'many'
                }
             })
            if (res.meta.status !== 200){
                    return this.$message.error('获取商品参数失败')
                }
             res.data.forEach(item => {
                 item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.split(',')
             })
             this.manyTableData = res.data
            } else if (this.activeIndex === '2') {
                console.log('商品属性面板')
                const { data:res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params:{
                        sel:'only'
                    }
                })
                console.log(res)
                if (res.meta.status !== 200){
                    return this.$message.error('获取商品属性失败')
                }
                res.data.forEach(item => {
                item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.split(',')
                })
                console.log(res.data)
                this.onlyTableData = res.data
            }
        },
        // 处理图片预览效果
        handlePreview(file){
            console.log(file)
            this.previewPath = file.response.data.url
            this.previewVisible = true
        },
        // 处理图片移除的操作
        handleRemove(file){
            // 获取删除图片的临时路径
            const filePath = file.response.data.tmp_path
            // 从 pics数组中找到这个图片对应的索引值
            // 调用数组中的splice方法将图片信息对象从pic中移除
            console.log(filePath)
           const index = this.addForm.pics.findIndex(x => {
                x.pic === filePath
            })
            this.addForm.pics.splice(index, 1)
            console.log(this.addForm)
        },
        // 监听图片上传成功的事件 图片上传成功
        handleSuccess(response){
            console.log(response)
            // 拼接得到一个图片信息对象
            const pictureInfo = {
                pic:response.data.tmp_path
            }
            // 将每一次上传成功的图片临时路径存到addform 的pics 数组中
            this.addForm.pics.push(pictureInfo)
            console.log(this.addForm)
        },
        add(){
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) {
                    return this.$message.error('请先填写必要的表单项')
                }
                // 处理表单数据goods_cat数组转成逗号分隔的字符串
                this.addForm.goods_cat = this.addForm.goods_cat.join(',')
                // 处理动态参数
                this.manyTableData.forEach(item => {
                    const newManyInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(',')
                    }
                    this.addForm.attrs.push(newManyInfo)
                })
                // 处理静态属性
                this.onlyTableData.forEach(item => {
                    const newOnlyInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(',')
                    }
                    this.addForm.attrs.push(newOnlyInfo)
                })
                console.log(this.addForm)
                const { data:res } = await this.$http.post('goods', this.addForm)
                console.log(res)
                if (res.meta.status !== 200 ) {
                    return this.$message.error('创建商品失败')
                }
                this.$message.success('创建商品成功')
            })
        }
    },
    computed:{
            cateId(){
                if (this.addForm.goods_cat.length === 3) {
                    return this.addForm.goods_cat[2]
                }
                return null
            }
        }
}
</script>

<style lang="less" scoped>
    .el-steps {
        margin: 15px 0;
    }
    ::v-deep .el-step__title {
    font-size: 13px;
    }
    ::v-deep .el-cascader{
        .el-input {
            width: 200px;
        }
    }
    .el-checkbox{
        margin: 0 10px 0 0 !important;
    }
    .el-tab-pane{
        .el-button{
            margin-top: 12px;
        }
    }
</style>>

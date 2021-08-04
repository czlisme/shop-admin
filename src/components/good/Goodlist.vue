<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="10">
                <el-col :span="10">
                    <el-input placeholder="请输入搜索内容" class="input-with-select">
                          <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="toAdd">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table
                :data="goodList"
               >
               <el-table-column type="index" label="#" ></el-table-column>
                <el-table-column
                    prop="goods_name"
                    label="商品名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_name"
                    label="商品价格"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_name"
                    label="商品重量"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_name"
                    label="商品创建时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_name"
                    label="操作"
                    >
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.pagenum"
                :page-size="queryInfo.pagesize"
                :page-sizes="[10,20,50,100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10,
            },
            // 商品列表
            goodList:[],
            // 数据总条数
            total:0
        }
    },
    methods: {
        async getGoodList(){
            const { data:res } = await this.$http.get('goods', {
                params:this.queryInfo
            })
            if (res.meta.status !== 200 ) {
                return this.$message.error('获取商品列表失败')
            }
            console.log(res.data)
            this.getGoodList = res.data.goodList
            this.total = res.data.total
        },
        handleSizeChange(){},
        handleCurrentChange(){},
        toAdd(){
            this.$router.push('goods/add')
        }
    },
    created() {
        this.getGoodList()
    },
}
</script>

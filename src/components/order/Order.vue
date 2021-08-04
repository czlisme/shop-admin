<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="10">
                <el-col :span="8" style="min-width:260px">
                    <el-input placeholder="请输入搜索内容" class="input-with-select" v-model="searchValue" @keyup.enter.native="getSearchOrder">
                          <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="16">
                    <el-pagination
                         layout="total, sizes, prev, pager, next, jumper"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.pagenum"
                        :page-sizes="[5, 10, 20, 50]"
                        :page-size="20"
                        :total="total">
                    </el-pagination>
                </el-col>
            </el-row>
            <el-table
                :data="orderList"
                stripe
                border
                height="500px"
                >
                <el-table-column
                    type="index"
                    label="#"
                    width="width">
                </el-table-column>
                <el-table-column
                    prop="order_number"
                    label="订单编号" >
                </el-table-column>
                <el-table-column
                    prop="order_price"
                    label="订单价格" >
                </el-table-column>
                <el-table-column
                    label="是否付款" >
                    <template slot-scope="scope">
                        <el-tag effect="dark" size="mini" v-if="Number(scope.row.order_pay) === 1">已付款</el-tag>
                        <el-tag effect="dark" type="danger" size="mini" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="is_send"
                    label="是否发货" >
                </el-table-column>
                <el-table-column
                    label="下单时间" >
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                    width="120px"
                    label="操作" >
                    <template>
                        <el-tooltip class="item" effect="dark" content="修改订单地址" placement="top">
                            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showAddress">
                        </el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="查看物流信息" placement="top">
                            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressDialog"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 修改地址信息对话框 -->
            <el-dialog
                title="物流进度"
                :visible.sync="addressVisible"
                width="50%"
                @close="addressDialogClose"
                >
                <div>
                    <el-form ref="addressFormRef" :rules="rules" :model="addressForm" label-width="85px">
                        <el-form-item label="省市区/县" prop="address1">
                        <el-cascader
                            :options="cityData"
                            v-model="addressForm.address1"
                            >
                        </el-cascader>
                        </el-form-item>
                        <el-form-item label="详细地址" prop="address2">
                        <el-input v-model="addressForm.address2" placeholder=""></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer">
                    <el-button @click="addressVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 查看物流信息对话框 -->
            <el-dialog
                title="物流进度"
                :visible.sync="progressVisible"
                width="50%"
                >
                <div>
                    <el-timeline :reverse="false">
                        <el-timeline-item
                        v-for="(item, index) in progressInfo"
                        :key="index"
                        :timestamp="item.ftime"
                        color="skyblue"
                        >
                        {{item.context}}
                        </el-timeline-item>
                    </el-timeline>
                </div>
                <div slot="footer">
                    <el-button @click="progressVisible = false">取 消</el-button>
                    <el-button type="primary" @click="progressVisible  = false">确 定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
import cityData from './citydata.js'
export default {
    data() {
        return {
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:20
            },
            orderList:[],
            total:0,
            searchValue:'',
            addressVisible:false,
            addressForm:{
                address1:'',
                address2:''
            },
            rules:{
                address1:[
                    { required:true, message:'请选择地址', trigger:'blur' }
                ],
                address2:[
                    { required:true, message:'请输入详细地址', trigger:'blur' }
                ]

            },
            cityData,
            progressVisible:false,
            progressInfo:[]
        }
    },
    methods: {
        async getOrderList(){
            const { data: res } = await this.$http.get('orders', {
                params:this.queryInfo
            })
            if ( res.meta.status !== 200 ) {
                return this.$message.error('获取数据失败')
            }
            console.log(res.data)
            this.total = res.data.total
            this.orderList = res.data.goods
        },
        // 更新每页数据大小
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        // 改变当前页
        handleCurrentChange(newPagenum){
            this.queryInfo.pagenum = newPagenum
            this.getOrderList()
        },
        getSearchOrder(){
            this.queryInfo.query = this.searchValue
            this.getOrderList()
        },
        showAddress(){
            this.addressVisible = true
        },
        // 显示物流进度对话框
        async showProgressDialog(){
            const { data: res } = await this.$http.get('/kuaidi/1106975712662')
            if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
            console.log(res)
            this.progressInfo = res.data
            this.progressVisible = true
        },
        addressDialogClose(){
            this.$refs.addressFormRef.resetFields()
        }
    },
    created() {
        this.getOrderList()
    },
}
</script>
<style lang="css">
    .el-cascader{
        width: 100%;
    }
    .el-pagination{
        min-width: 300px;
        overflow: auto;
        margin-top: 5px;
    }
</style>

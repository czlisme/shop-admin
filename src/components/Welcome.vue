<template>
    <div class="welcome">
        <span>Welcome!</span>
         <!-- <el-carousel :interval="4000" type="card" height="400px">
            <el-carousel-item v-for="item in 6" :key="item">
            </el-carousel-item>
        </el-carousel> -->
    </div>
</template>
<script>
export default {
    data(){
        return {
            imgPath:[]
        }
    }
}
</script>
<style lang="less" scoped>
.welcome {
    box-sizing: content-box;
    width: 100%;
    height: 100%;
    background-color: #2c343c;
    background: url('../assets/images/bg.jpg') no-repeat center/100% 100%;
    span{
        display: block;
        color: #fff;
        font-size: 28px;
        padding: 20px;
    }
//   .el-carousel__item h3 {
//     color: #475669;
//     font-size: 14px;
//     opacity: 0.75;
//     line-height: 200px;
//     margin: 0;
//   }
//   .el-carousel__item:nth-child(2n) {
//     background-color: #99a9bf;
//   }
}
</style>

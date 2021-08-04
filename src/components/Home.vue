<template>
  <div class="home">
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header height="70px">
        <div>
          <img src="../assets/images/logo.png" alt="">
          <span>宜春学院电商管理系统</span>
        </div>
        <el-button type="success" @click="logout">退出</el-button>
      </el-header>
      <!-- 侧边栏 -->
      <el-container>
        <el-aside :width="isCollapse ? '64px' : '200px' ">
          <!-- 菜单 -->
          <div class="toggle-button" @click="toggleCollapse">
            |||
          </div>
          <el-menu
              :default-active="activePath"
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409EFF"
              unique-opened
              :collapse="isCollapse"
              :collapse-transition="false"
              router
              >
              <!-- 导航一  动态绑定index 绑定的为字符串所以拼接 +上 ''-->
              <el-submenu :index="item.id+ ''" v-for="item in menulist" :key="item.id">
                <!-- 一级菜单模板区域 -->
                <template slot="title">
                  <!-- 一级菜单图标 -->
                  <i :class="iconObj[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                  <el-menu-item :index=" '/'+ subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState( '/'+ subItem.path)">
                    <!-- 动态生成二级菜单icon -->
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                  </el-menu-item>
              </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
     </el-container>
    </el-container>
    </div>
</template>
<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menulist: [],
      //icon 图标类名
      iconObj:{
        125:'el-icon-user-solid',
        103:'el-icon-star-on',
        101:'el-icon-s-goods',
        102:'el-icon-s-order',
        145:'el-icon-data-line'
      },
      //侧边栏折叠
      isCollapse:false,
      //被激活的链接
      activePath:''
    }
  },
  //生命周期函数
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
    methods: {
      //退出登录功能
        logout(){
          this.$confirm('你确定退出登录吗?', '退出登录', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          })
          .then(() => {
            window.sessionStorage.clear()
            this.$router.push('/login')
          })
          .catch(() => {
            this.$message.info('已取消退出登录')
          })
        },
        //获取菜单数据功能
        async getMenuList(){
         const { data : res } = await this.$http.get('menus')
         if ( res.meta.status !== 200) return this.$message.error(res.meta.msg)
             this.menulist = res.data
        },
        //切换菜单折叠功能
        toggleCollapse(){
          this.isCollapse = !this.isCollapse
        },
        //实现刷新后菜单选项高亮功能 保存链接激活状态
        saveNavState(activePath){
          window.sessionStorage.setItem('activePath', activePath)
          this.activePath = activePath
        }
    }
}
</script>
<style lang="less" scoped>
.home{
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  .el-container{
    width: 100%;
    height: 100%;
      .el-header{
        display: flex;
        justify-content: space-between;
        background-color:#373d41;
        padding-left: 0;
        font-size: 20px;
        color: #fff;
        align-items: center;
        >div{
          height: 100%;
          display: flex;
          justify-content: left;
            img{
            width: 80px;
            height: 100%;
            border-radius: 50%;
            border: 1px solid aqua;
            box-shadow: 0 0 10px;
           }
           span{
             line-height: 70px;
             padding: 0 15px;
             font-size: 18px;
           }
        }
      .el-button{
        padding: 10px;
      }
    }
  .el-aside{
    box-sizing: content-box;
    height: 100%;
    .el-menu {
      height: 96%;
      border-right: 0;
      span{
        font-size: 12px !important;
      }
   }
    .toggle-button {
     height: 4%;
     background-color: #4A5064;
     color: #fff;
     text-align: center;
     font-size: 16px;
     letter-spacing: 0.2em;
     cursor: pointer;
     line-height: 25px;
   }:hover{
       color: #409EFF;
     }
   }
  .el-main{
    padding: 0;
    border: 1px solid pink;
  }
  }
}

</style>

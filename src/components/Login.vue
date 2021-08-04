<template>
  <div class="Login_container">
    <div class="login_box">
      <div class="logo_box">
        <img src="../assets/images/logo.png" alt="" />
      </div>
      <div>
        <!-- 验证错误提示 -->
           <el-alert class="error"
    :title="alertData.title"
    type="error"
    :style="alertData.style"
    >
  </el-alert>
        <!-- 登录表单区域 -->
        <el-form class="login_form " :rules="loginRule" ref="loginFormRef"  :model="loginForm" status-icon >

          <el-form-item  prop="username">
            <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              prefix-icon="el-icon-lock" v-model="loginForm.password"  placeholder="请输入密码" :type="type"  @keyup.enter.native="login">
                  <i slot="suffix" class="el-input__icon el-icon-view open" @click.prevent="controlIcon"></i>
              </el-input>
          </el-form-item>
            <el-form-item class="login_root">
              <el-button type="primary" round @click="login">登录</el-button>
              <el-button type="danger" round @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: 'password',
      alertData:{
        style:'display:none',
        title:'1212'
      },
      loginForm: {
        username: '',
        password: '',
      },
      loginRule: {
        username: [
          { required: true, message: '请输入管理员账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 包含字母数字的字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm: function(){
        this.$refs.loginFormRef.resetFields()
    },
    login: function () {
       this.$refs.loginFormRef.validate(async valid => {
         if (!valid){
           return false
         } else {
          const { data } = await this.$http.post('/login', this.loginForm)
          if (data.meta.status !== 200 ) {
            return this.vaildErr(data.meta.msg)
          } else {
            this.$message.success('登录成功')
            window.sessionStorage.setItem('token', data.data.token)
            this.$router.push('/home')
          }
         }
       })
    },
    vaildErr: function(err) {
      this.alertData.style = 'display:block'
      this.alertData.title = err
      const that = this
      setTimeout(function(){
        that.alertData.style = 'display:none'
      }, 2000)
    },
    controlIcon: function(){
      if (this.type === 'password') {
        this.type = 'text'
        } else {
           this.type = 'password'
        }
    },
  }
}
</script>
<style lang="less" scoped >
.Login_container {
  box-sizing: content-box;
  width: 100%;
  height: 100%;
  background: url('../assets/images/bg.jpg') no-repeat center top ;
  background-size: cover;
  .login_box {
    width: 390px;
    height: 320px;
    background-color:transparent;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;
    border:1px solid aqua;
    .logo_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      position: relative;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px 10px #ddd;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .error{
     width: 90%;
    position: relative;
    top: -30px;
    margin: auto;
    }
    .login_form {
      margin-top: -20px;
      padding: 0 20px;
      .open{
        cursor: pointer;
      }
      .login_root{
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>

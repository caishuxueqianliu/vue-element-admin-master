<template>

  <div class="login-container">

<div class=   "login">
 <el-form ref='loginFormRef' :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h1 class="title" style="text-align: center;">Vue后台管理系统</h1>
      </div>

  <el-form-item prop="username">
   <el-input placeholder="Username"name="username"type="text" v-model='loginForm.username' 
   tabindex="1" autocomplete="on" prefix-icon="el-icon-user-solid" />
      </el-form-item>

    <el-form-item prop='password'>
  <el-input v-model='loginForm.password' placeholder="Password" name="password"tabindex="2" prefix-icon="el-icon-lock" autocomplete="on"  type="text"/>
    </el-form-item>

       <el-form-item>
      <el-button  type="primary" @click='login' >Login</el-button>
     <el-button  type="info" @click='reset'>Reset</el-button>
        </el-form-item>
    </el-form>

   </div>
</div>
</template>

<script>


export default {
  name: 'Login',

  data() {
   var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (value.length>6) {
            callback(new Error('请输入合适的位数'))
          }
          callback();
        }
      };
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      
      loginRules: {
        username: [
        { required: true, trigger: 'blur', message: '请输入用户名' } ,
        { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [{ validator: validatePass, trigger: 'blur' }]
      }
      // passwordType: 'password',
      // capsTooltip: false,
      // loading: false,
      // showDialog: false,
      // redirect: undefined,
      // otherQuery: {}
    }
  },
  watch: {
   
  },
  created() {

  },
  mounted() {
  
  },
  destroyed() {
   
  },
  methods: {
   login(){

 this.$refs.loginFormRef.validate(async valid=>{
  // console.log(valid);
   if(!valid) return;
   const {data:res}=await this.$http.post('/login',this.loginForm);
   if(res.meta.status!==200)return this.$message.error('登陆失败')
   this.$message.success('登陆成功');
 // console.log(res);
//将token存储到本地session存储中
 window.sessionStorage.setItem("token",res.data.token);
//编程式导航
 this.$router.push("/home");


 });
   },
  reset()
{
 this.$refs.loginFormRef.resetFields();

} 


 }
}
</script>

<style lang="less" scoped="" type="">
.login-container{
  height:100%;
  background-color: #333744;
  display:flex;
justify-content:center;
align-items:center;

 .login{

 width:450px;
 height:300px;

.login-form{
width:100%;
color:white;
background-color: #333744;
border-radius: 5px;

}
.el-button{
  position: relative;
width: 100%;
  margin-top: 30px;
  float: right;
}
}
}
</style>

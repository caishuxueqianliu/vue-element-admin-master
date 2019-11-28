<template>

  <div class="login-container">

 <el-form ref='loginFormRef' :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
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
        password: '111111'
      },
      
      loginRules: {
        username: [
        { required: true, trigger: 'blur', message: '请输入用户名' } ,
        { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' },
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

 this.$refs.loginFormRef.validate((boolean,valid)=>{
  console.log(boolean);
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
.login-container
{

background-color:gray;


}
.login-form{

width: 450px;
height: 300px;
background-color: white;
border-radius: 5px;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%,-50%);
}
.el-button{
  position: relative;
width: 100%;
  margin-top: 30px;
  float: right;
}

</style>

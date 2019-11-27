<template>

  <div class="login-container">

    <el-form ref="loginForm" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

  <el-form-item prop="username">
   <el-input placeholder="Username"name="username"type="text" 
   tabindex="1" autocomplete="on"/>
      </el-form-item>

    <el-form-item prop="password">
  <el-input placeholder="Password" name="password"tabindex="2" autocomplete="on"  />
    </el-form-item>
    
      <el-button  type="primary"  >Login</el-button>

    </el-form>

   </div>

</template>

<script>


export default {
  name: 'Login',

  data() {
  
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
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
   
  
  }
}
</script>

<style lang="less" scoped="" type="">
.login-form{

width: 450px;
height: 300px;
background-color: pink;
border-radius: 5px;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%,-50%);
}
.el-button{
width: 100%;
  margin-top: 30px;
}

</style>

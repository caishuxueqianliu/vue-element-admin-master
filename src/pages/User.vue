<template>
<div>
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
 <el-card>
<el-row :gutter="20">
  <el-col :span="10">
   
    <el-input placeholder="请输入内容" v-model='queryInfo.query' @clear="getUserList()" clearable>
    <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
  </el-input>


</el-col>

  <el-col :span="4">
    <el-button type='primary'@click="addDialogUser()">添加用户</el-button>
  </el-col>

</el-row>

 <el-table
      :data="userList" stripe border>
       <el-table-column
       type='index'>
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名">
      </el-table-column>
           <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
            <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
            <el-table-column
        prop="role_name"
        label="角色">
      </el-table-column>
              <el-table-column
        prop="mg_state"
        label="状态">
        <template slot-scope='scope'>
          
          <el-switch v-model="scope.row.mg_state"
         active-color="#409EFF"
         @change="userStateChanged(scope.row)">
            
          </el-switch>
          <!-- {{scope.row.mg_state}} -->
        </template>
      </el-table-column>
    <el-table-column    
        label="操作"
              prop=""
              width="180px">
              <!-- 作用域插槽 -->
        <template slot-scope='scope'>
 <el-button type="primary" size='mini' icon="el-icon-edit" @click=editUser(scope.row.id)></el-button>
 <el-button type="danger"size='mini' icon="el-icon-delete"  @click=delDialog(scope.row.id) ></el-button>

 <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false" >
  <el-button type="warning"size='mini' icon="el-icon-setting" @click="showUserDialog(scope.row)"></el-button>
    </el-tooltip>
 

        </template>
      </el-table-column>

    </el-table>
 <el-pagination     background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
 </el-card>
<!-- 对话框 -->

<el-dialog :close-on-click-modal="false" :close-on-press-escape='false'
  title="提示"
  :visible.sync="dialogVisible"
  width="50%" @close="addDialogClosed()">
  
  <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="70px">

  <el-form-item label="姓名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
      <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
    <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>

</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser()">确 定</el-button>
  </span>
</el-dialog>

<!-- 修改用户信息的对话框 -->
<el-dialog :close-on-click-modal="false" :close-on-press-escape='false'
  title="修改用户信息"
  :visible.sync="editDialogVisible"
  width="50%" @close="editDialogClosed()">
   <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="70px">
 <el-form-item label="姓名" prop="username" >
    <el-input disabled v-model="editForm.username"></el-input>
  </el-form-item>
    
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>

    <el-form-item label="手机" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>

</el-dialog>

<!-- 分配角色对话框 -->
<el-dialog
  title="提示"
  :visible.sync="userDialogVisible"
  width="30"  :close-on-click-modal="false" :close-on-press-escape='false' @close="userDialogClosed()">
<p>当前的用户:{{userInfo.username}}</p>
<p>当前的角色:{{userInfo.role_name}}</p>
<p>分配新角色:
<el-select v-model="selectedRoleId" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select></p>
  <span slot="footer" class="dialog-footer">
    <el-button @click="userDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveUser()">确 定</el-button>
  </span>
</el-dialog>

</div>
</template>

<script>


export default {
 

  data() {
    var checkEmail=(rule,value,callback)=>{
      const regEmail=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if(regEmail.test(value)){
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }

      var checkMobile=(rule,value,callback)=>{
        const regMobile=/^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if(regMobile.test(value)){
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
    queryInfo:{

      query:'',
      //当前页
      pagenum:1,
      //当前每页显示条数
      pagesize:2
      },
      userList:[],
      userInfo:{},
      rolesList:[],
      selectedRoleId:'',
      userDialogVisible:false,
      total:0,
      dialogVisible:false,
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''

      },
      editForm:{
        username:'',
        email:'',
        mobile:''
      },
       addRules: {
        username: [
        { required: true, trigger: 'blur', message: '请输入用户名' } ,
        { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [ { required: true, trigger: 'blur', message: '请输入密码' },
         { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }],
           email: [ { required: true, trigger: 'blur', message: '请输入邮箱' },
         { validator: checkEmail, trigger: 'blur' }],
           mobile: [ { required: true, trigger: 'blur', message: '请输入手机号' },
         { validator: checkMobile, trigger: 'blur' }]
      },
      editDialogVisible:false,
    editRules:{

  email: [ 
      { required: true, trigger: 'blur', message: '请输入邮箱' },
         { validator: checkEmail, trigger: 'blur' }],
  mobile: [ { required: true, trigger: 'blur', message: '请输入手机号' },
         { validator: checkMobile, trigger: 'blur' }]
      }

      
   
}
    
    },
    
  created() {
this.getUserList();
  },
  mounted() {
  
  },
  destroyed() {
   
  },
  methods: {
  
async getUserList(){
 
 const {data:res}=await this.$http.get('/users',{params:this.queryInfo})
 if(res.meta.status!==200){
  return this.$message.error('获取用户列表失败')
 }
this.$message.success('获取用户列表成功')
  this.userList=res.data.users;
    // console.log(this.userList)
  this.total=res.data.total
},
handleSizeChange(newSize){
this.queryInfo.pagesize=newSize;
this.getUserList();

},
handleCurrentChange(newPage){
this.queryInfo.pagenum=newPage;
this.getUserList();

},
 async userStateChanged(userInfo){

const{data:res}=await this.$http.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`)
if(res.meta.status!==200){
  userInfo.mg_state=!userInfo.mg_state
  return this.$message.error('更新用户信息失败！')
}
this.$message.success('更新用户信息成功！')

},
addDialogUser(){
  this.dialogVisible=!this.dialogVisible
},
   addDialogClosed(){
        this.$refs.addFormRef.resetFields();
      },
 addUser(){
        this.$refs.addFormRef.validate(async valid=>{
  // console.log(valid);
  if(!valid) return;
        const {data:res}= await this.$http.post('/users',this.addForm)
     
        if(res.meta.status!==201){
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
         this.dialogVisible=false
         this.getUserList()

      })
      },
async editUser(id){
       
const {data:res}=await this.$http.get('/users/'+id)

   if(res.meta.status!==200){
    return    this.$message.error('查询用户失败')
      }

       this.editDialogVisible=true
       this.editForm=res.data

 },
   editDialogClosed(){
        this.$refs.editFormRef.resetFields();
      },
editUserInfo(){
    this.$refs.editFormRef.validate(async valid=>{
  // console.log(valid)
  if(!valid) return;
        const {data:res}= await this.$http.put('/users/'+ this.editForm.id,
          this.editForm
        )
        if(res.meta.status!==201){
          this.$message.error('修改用户失败')
        }
        this.$message.success('修改用户成功')
         this.editDialogVisible=false
         this.getUserList()

})
},
 // async delDialog(id) {
 //    console.log(id)
 //      const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
 //          confirmButtonText: '确定',
 //          cancelButtonText: '取消',
 //          type: 'warning'
 //        }).then(() => {
 //          this.$message({
 //            type: 'success',
 //            message: '删除成功!'
 //          });
 //        }).catch(() => {
 //          this.$message({
 //            type: 'info',
 //            message: '已取消删除'
 //          });          
 //        });
 //        console.log(confirmResult)
 //      }
 async delDialog(id) {
    console.log(id)
      const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      
        }).catch(err=>{
          return err
   
      })
        console.log(confirmResult)
        if(confirmResult!=='confirm'){
          return   this.$message.info('已取消删除')
        }
        const {data:res}=await this.$http.delete('/users/'+id)
        if(res.meta.status!==200){
          return this.$message.error('删除用户失败')
        }
       this.$message.success('删除用户成功')
       this.getUserList();
      },
 async showUserDialog(userInfo){
        this.userInfo=userInfo
      const {data:res}=await this.$http.get('/roles')
 if(res.meta.status!==200){
          return this.$message.error('获取角色失败')
        }
       this.$message.success('获取角色成功')
    this.rolesList=res.data

this.userDialogVisible=true
      },
  
async saveUser(){
if(!this.selectedRoleId){
   return this.$message.error('请选择要分配的角色')
}
// console.log(this.userInfo.id)
// console.log(this.selectedRoleId)
 const {data:res}=await
  this.$http.put(`/users/${this.userInfo.id}/role`,{
  rid:this.selectedRoleId
 })
 if(res.meta.status!==200){
          return this.$message.error('更新角色失败')
        }
       this.$message.success('更新角色成功')
       this.getUserList();
this.userDialogVisible=false
      },
          userDialogClosed(){
    this.selectedRoleId=''
    this.userInfo=''
      },

}
}
</script>

<style lang="less" scoped="" type="">

</style>

<template>


  <div >
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>

 <el-card>
  <el-row :gutter="20">
  <el-col :span="10">
   
  


</el-col>

  <el-col :span="4">

    <el-button type='primary'@click="addDialogRoles()">添加角色</el-button>
  </el-col>

</el-row>
   
 <el-table :data="rolesList" stripe border>
    <el-table-column
       type="expand"
       label="展开" width="54px">
      </el-table-column>
   <el-table-column
       type='index'
       label="序列" width="54px">
      </el-table-column>

      <el-table-column
        prop="roleName"
        label="角色名称">
      </el-table-column>
   <el-table-column
        prop="roleDesc"
        label="角色描述">
      </el-table-column>
         <el-table-column
       
        label="操作" width="300px">
    <template slot-scope='scope'>
 <el-button type="primary" size='mini' icon="el-icon-edit" @click=editRoles(scope.row.id)>编辑</el-button>
 <el-button type="danger"size='mini' icon="el-icon-delete"  @click=delRolesDialog(scope.row.id) >删除</el-button>

 
  <el-button type="warning"size='mini' icon="el-icon-setting" >
    分配角色
  </el-button>
   
 

        </template>
      </el-table-column>
   
    </el-table>
   <el-pagination
      @size-change="SizeChange"
      @current-change="CurrentChange"
      :current-page="currentpage"
      :page-sizes="[ 2, 4, 8]"
      :page-size="pagesize"
    
      layout=" sizes, prev, pager, next, jumper">
    </el-pagination>
 </el-card>
 <!-- 对话框 -->

<el-dialog :close-on-click-modal="false" :close-on-press-escape='false'
  title="提示"
  :visible.sync="dialogRolesVisible"
  width="50%" @close="addRolesDialogClosed()">
  
  <el-form :rules="addRules" :model="addRolesForm"  ref="addRolesFormRef" label-width="70px">

  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addRolesForm.roleName"></el-input>
  </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addRolesForm.roleDesc"></el-input>
  </el-form-item>

</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogRolesVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles()">确 定</el-button>
  </span>
</el-dialog>

<!-- 修改用户信息的对话框 -->

<el-dialog :close-on-click-modal="false" :close-on-press-escape='false'
  title="修改角色信息"
  :visible.sync="editRolesVisible"
  width="50%" @close="editRolesDialogClosed()">
   <el-form :model="editRolesForm" :rules="editRules" ref="editRolesFormRef" label-width="70px">
 <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="editRolesForm.roleName"></el-input>
  </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="editRolesForm.roleDesc"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRolesInfo">确 定</el-button>
  </span>

</el-dialog>
</div>
</template>

<script>


export default {
 

  data() {
  
    return {
   
      rolesList:[],
  
     total:'',
pagesize:2,
currentpage:1,
    rolesList:[],
          dialogRolesVisible:false,
          editRolesVisible:false,
      addRolesForm:{
        roleName:'',
        roleDesc:''
      },
      editRolesForm:{
        roleName:'',
        roleDesc:''
      }, 
       addRules: {
        roleName: [
        { required: true, trigger: 'blur', message: '请输入角色名' } ,
        { min: 3, max: 6, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc: [ { required: true, trigger: 'blur', message: '请输入角色描述' },
         { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }]
        
      },
    editRules:{

    roleName: [ { required: true, trigger: 'blur', message: '请输入角色名' } ,
        { min: 3, max: 6, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc: [ { required: true, trigger: 'blur', message: '请输入角色描述' },
         { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }]
      }

  
    }
    },
    
  created() {
this.getRolesList();
  },
  mounted() {
  
  },
  destroyed() {
   
  },
  methods: {
async getRolesList(){

  const{data:res}=await this.$http.get('roles')

if(res.meta.status!==200){
  return this.$message.error("获取权限列表失败")
}
this.$message.success("获取权限列表成功")
this.rolesList=res.data
  // console.log(this.rolesList)
 // 表格children处理
 this.rolesList = this.rolesList.map(item => {
　　　　　　return {
　　　　　　　　roleName: item.roleName,
　　　　　　　　roleDesc: item.roleDesc,
　　　　　　　　id: item.id,
　　　　　　　　childrens: item.children
　　　　　　};
　　　　});
 console.log(this.rolesList.length)
 // this.total=this.rolesList.length
  },
   SizeChange(val) {
       this.pagesize=val;
                       
      },
      CurrentChange(val) {
              this.currentpage=val;

      },
  addDialogRoles(){
  this.dialogRolesVisible=!this.dialogRolesVisible
},
   addRolesDialogClosed(){
        this.$refs.addRolesFormRef.resetFields();
      },
 addRoles(){
        this.$refs.addRolesFormRef.validate(async valid=>{
  // console.log(valid);
  if(!valid) return;
        const {data:res}= await this.$http.post('roles',this.addRolesForm)
  
        if(res.meta.status!==201){
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
         this.dialogRolesVisible=false
         this.getRolesList()

      })
      },
 async editRoles(id){
       // console.log(id)
const {data:res}=await this.$http.get('roles/'+id)

   if(res.meta.status!==200){
    return    this.$message.error('查询角色失败')
      }

       this.editRolesVisible=true
       this.editRolesForm=res.data

 },
editRolesDialogClosed(){
        this.$refs.editRolesFormRef.resetFields();
      },
editRolesInfo(){
    this.$refs.editRolesFormRef.validate(async valid=>{
  // console.log(valid)
  if(!valid) return;
        const {data:res}= await this.$http.put('roles/'+ this.editRolesForm.roleId,
          this.editRolesForm
        )
        if(res.meta.status!==201){
          this.$message.error('修改角色失败')
        }
        this.$message.success('修改角色成功')
         this.editRolesVisible=false
         this.getRolesList();
           // console.log( this.editRolesForm)
           // console.log( this.editRolesForm.id)

})
},

 async delRolesDialog(id) {
    // console.log(id)
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
        const {data:res}=await this.$http.delete('roles/'+id)
        if(res.meta.status!==200){
          return this.$message.error('删除用户失败')
        }
       this.$message.success('删除用户成功')
       this.getRolesList();
      }




 }
}
</script>

<style lang="less" scoped="" type="">


</style>

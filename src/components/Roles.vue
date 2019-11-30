<template>


  <div >
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>

 <el-card>
    <el-button type='primary'>添加角色</el-button>
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
 </el-card>
 <!-- 对话框 -->

<el-dialog :close-on-click-modal="false" :close-on-press-escape='false'
  title="提示"
  :visible.sync="dialogRolesVisible"
  width="50%" @close="addRolesDialogClosed()">
  
  <el-form :model="addRolesForm"  ref="addRolesFormRef" label-width="70px">

  <el-form-item label="角色名称" prop="rolesName">
    <el-input v-model="addRolesForm.reoleName"></el-input>
  </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addRolesForm.rolesDesc"></el-input>
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
   <el-form :model="editRolesForm"  ref="editRolesFormRef" label-width="70px">
 <el-form-item label="角色名称" prop="rolesName">
    <el-input v-model="editRolesForm.roleName"></el-input>
  </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="editRolesForm.roleDesc"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRolesrInfo">确 定</el-button>
  </span>

</el-dialog>
</div>
</template>

<script>


export default {
 

  data() {
  
    return {
    rolesList:[],
          dialogRolesVisible:false,
          editRolesVisible:false,
      addRolesForm:{
        rolesName:'',
        rolesDesc:''
      },
      editRolesForm:{
           rolesName:'',
        rolesDesc:''
      }, 
  
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

 console.log(this.rolesList)
 // 表格children处理
 this.rolesList = this.rolesList.map(item => {
　　　　　　return {
　　　　　　　　roleName: item.roleName,
　　　　　　　　roleDesc: item.roleDesc,
　　　　　　　　id: item.id,
　　　　　　　　childrens: item.children
　　　　　　};
　　　　});
  },
  addRolesDialogUser(){
  this.dialogVisible=!this.dialogVisible
},
   addRolesDialogClosed(){
        this.$refs.addRolesFormRef.resetFields();
      },
 addRoles(){
        this.$refs.addRolesFormRef.validate(async valid=>{
  // console.log(valid);
  if(!valid) return;
        const {data:res}= await this.$http.post('users',this.addRolesForm)
        console.log(res)
        if(res.meta.status!==201){
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
         this.dialogVisible=false
         this.getRolesList()

      })
      },
 async editRoles(id){
      
const {data:res}=await this.$http.get('roles/'+id)

   if(res.meta.status!==200){
    return    this.$message.error('查询角色失败')
      }

       this.editRolesVisible=true
       this.editRolesForm=res.data
 console.log( this.editRolesForm)
 },
editRolesDialogClosed(){
        this.$refs.editRolesFormRef.resetFields();
      },
editRolesInfo(){
    this.$refs.editRolesFormRef.validate(async valid=>{
  // console.log(valid)
  if(!valid) return;
        const {data:res}= await this.$http.put('roles/'+ this.editRolesForm.id,
          this.editRolesForm
        )
        if(res.meta.status!==201){
          this.$message.error('修改角色失败')
        }
        this.$message.success('修改角色成功')
         this.editRolesDialogVisible=false
         this.getRolesList()

})
},

 async delRolesDialog(id) {
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

<template>

  <div >
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>
 <el-card>

 <el-table
      :data="rightsList" stripe border>
       <el-table-column
       type='index'>
      </el-table-column>

      <el-table-column
        prop="authName"
        label="权限名称">
      </el-table-column>

      <el-table-column
        prop="path"
        label="路径">
      </el-table-column>

      <el-table-column
        prop="level"
        label="权限等级">
        <template slot-scope='scope'>
          <el-tag v-if="scope.row.level==='0'">一级</el-tag>
          <el-tag type='success' v-else-if="scope.row.level==='1'">二级</el-tag>
          <el-tag type="warning" v-else="scope.row.level==='2'">三级</el-tag>

        </template>
      </el-table-column>
    </el-table>
 </el-card>
   </div>

</template>

<script>


export default {
 

  data() {
  
    return {
     rightsList:[]
      }
    },
    
  created() {
this.getRightsList();
  },
  mounted() {
  
  },
  destroyed() {
   
  },
  methods: {
  
 async getRightsList(){

  const{data:res}=await this.$http.get('/rights/list')
       // console.log(res)
if(res.meta.status!==200){
  return this.$message.error("获取权限列表失败")
}
this.$message.success("获取权限列表成功")
this.rightsList=res.data
}



 }
}
</script>

<style lang="less" scoped="" type="">


</style>

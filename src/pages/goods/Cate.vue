<template>

  <div >
<!-- 面包屑导航 -->
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item >商品分类</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片 -->
 <el-card>
  <!-- 添加分类  -->
 <el-row>
  <el-col>
    <el-button type='primary'@click="addCate()">添加分类</el-button>
  </el-col>
</el-row>
<!-- 表格 -->
 <tree-table :data="cateList" :columns="columns" 
 :selection-type='false':expand-type="false" show-index index-text="#" border>

        <template slot="isok" slot-scope="scope">      
     <i class='el-icon-success' v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
      <i class='el-icon-error' v-else style="color:red"></i>
        </template>
       
  <template slot="order" slot-scope="scope">      
    <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
    <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
    <el-tag v-else type="warning">三级</el-tag>
        </template>
       
    
    <template slot='opt' slot-scope='scope'>
 <el-button type="primary" size='mini' icon="el-icon-edit" @click=editCate(scope.row.cat_id)>编辑</el-button>
 <el-button type="danger"size='mini' icon="el-icon-delete" 
  @click=delCate(scope.row.cat_id) >删除</el-button>

        </template>
      </el-table-column> -->
   
    </tree-table>
<!-- 分页 -->
<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[1,2,5,8]"
      :page-size="querInfo.pagesize"
      :total="total"
   
      layout=" sizes, prev, pager, next, jumper">
    </el-pagination>

 </el-card>
<!-- 添加分类对话框 -->
<el-dialog  :close-on-click-modal="false" :close-on-press-escape='false'
  title="添加分类"
  :visible.sync="dialogCateVisible"
  width="50%" @close="addCateDialogClosed()">
  
  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">

  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>

      <el-form-item label="父级分类" >
    <!--     options用来指定数据源
        props用来指定配置对象 -->
   <el-cascader expandTrigger="hover"
    :options="parentCateList"
    :props="cascaderProps"
    v-model="selectOptons"
    @change="handleChange"></el-cascader>

  </el-form-item>

</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogCateVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCateOver()">确 定</el-button>
  </span>
</el-dialog>

<!-- 编辑分类对话框 -->
<el-dialog :close-on-click-modal="false" :close-on-press-escape='false'
  title="修改分类信息"
  :visible.sync="editRolesVisible"
  width="50%" @close="editRolesDialogClosed()">
   <el-form :model="editRolesForm" :rules="addCateFormRules" ref="editRolesFormRef" label-width="100px">
 <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editRolesForm.cat_name"></el-input>
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
    cateList:[],
    querInfo:{

      type:3,
      //当前页
      pagenum:1,
      //当前每页显示条数
      pagesize:5
      },
total:0,
columns:[
{
  label:'分类名称',
  prop:'cat_name'
},
{
  label:'是否有效',
  type:'template',
  template:'isok'
},
{
  label:'排序',
  type:'template',
  template:'order'
},
{
  label:'操作',
  type:'template',
  template:'opt'
}
],
dialogCateVisible:false,
  // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //父级分类列表
      parentCateList:[],
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      

      },
     
      selectOptons:[],
         editRolesForm:{
          cat_id:'',
            cat_name:''
         },
      
       editRolesVisible:false
       
      

      }
    },
    
  created() {
this.getCateList();

  },
  mounted() {
  
  },
  destroyed() {
   
  },
  methods: {
    //获取商品分类列表
  async getCateList(){
       
       const {data:res}=await this.$http.get('/categories',{
        params:this.querInfo
       })
        if(res.meta.status!==200){
    return    this.$message.error('获取商品分类列表失败')
      }

       this.cateList=res.data.result
       this.total=res.data.total
        // console.log(this.cateList)
//         this.cateList = this.cateList.map(item => {
// 　　　　　　return {
// 　　　　　　　　cat_name: item.cat_name,
// 　　　　　　　　cat_level: item.cat_level,
// 　　　　　　　　id: item.id,
// 　　　　　　　　childrens: item.children
// 　　　　　　};
// 　　　　});
  },
  handleSizeChange(newSize){
this.querInfo.pagesize=newSize;
this.getCateList();

},
handleCurrentChange(newPage){
this.querInfo.pagenum=newPage;
this.getCateList();

},

//获取父级分类的列表
async getParentCateList(){
  
    const {data:res}=await this.$http.get('/categories',{
        params:{type:2}
       })
        if(res.meta.status!==200){
    return    this.$message.error('获取父级分类列表失败')
      }

       this.parentCateList=res.data
    

},
// 添加分类按钮
addCate(){
 this.getParentCateList()
       
// console.log(this.parentCateList)

  this.dialogCateVisible=true

},
handleChange(){
  // 如果 selectOptons 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectOptons.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectOptons[
          this.selectOptons.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectOptons.length
        return
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
},
//重置表单
addCateDialogClosed(){
        this.$refs.addCateFormRef.resetFields();
         this.selectOptons = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
      },
      //
      // 完成添加
addCateOver(){
 // 点击按钮，添加新的分类
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          '/categories',
          this.addCateForm
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功！')
        this.getCateList()
        this.dialogCateVisible = false
      })
    },
    //删除分类功能
  async delCate(id){

//console.log(id)

   const result=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      
        }).catch(err=>{
          return err
   
      })
  
        if(result!=='confirm'){
          return   this.$message.info('已取消删除')
        }
        const {data:res}=await this.$http.delete('/categories/'+id)
        if(res.meta.status!==200){
          return this.$message.error('删除分类失败')
        }
       this.$message.success('删除分类成功')
      this.getCateList();
    },
    //编辑分类
 async editCate(id){
        // console.log(id)
const {data:res}=await this.$http.get('/categories/'+id)

   if(res.meta.status!==200){
    return    this.$message.error('查询分类名称失败')
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
        const {data:res}= await this.$http.put('/categories/'+ this.editRolesForm.cat_id,
          this.editRolesForm
        )
        if(res.meta.status!==201){
          this.$message.error('修改分类名称失败')
        }
       
        this.$message.success('修改分类名称成功')
          this.getCateList();
         this.editRolesVisible=false
            // console.log( this.editRolesForm.cat_name)

})
}



 }
}
</script>

<style lang="less" scoped="" type="">


</style>

<template>

  <div >

   <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item >商品列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
<el-row :gutter="20">
  <el-col :span="8">
    <!-- 搜索框 -->
 <el-input placeholder="请输入内容"  @clear="getGoodsList()" clearable
  v-model="queryInfo.query" class="input-with-select"> 
    <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
  </el-input>
  </el-col>
  <el-col :span="6">
    <!-- 添加商品 -->
  <el-button type="primary"@click="addGoods()">添加商品</el-button>
    </el-col>
</el-row>

<!-- 表格区域 -->

<el-table
      :data="goodsList" stripe border>
       <el-table-column
       type='index'>
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称">
      </el-table-column>
           <el-table-column
        prop="goods_price"
        label="价格">
      </el-table-column>
            <el-table-column
        prop="goods_number"
        label="数量">
      </el-table-column>
            <el-table-column
        prop="add_time"
        label="更新时间">
<template slot-scope="scope">
           
{{scope.row.add_time |dateFormat}}


         </template>


      </el-table-column>

    <el-table-column    
        label="操作"     
              width="180px">
              <!-- 作用域插槽 -->
 <template slot-scope='scope'>
 <el-button type="primary" size='mini' icon="el-icon-edit" @click=editGoods(scope.row.goods_id)></el-button>
 <el-button type="danger"size='mini' icon="el-icon-delete"  @click=delDialog(scope.row.goods_id) ></el-button>

        </template>
      </el-table-column>

    </el-table>
<!-- 分页功能 -->
 <el-pagination
        background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[4, 6, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>


<el-dialog :close-on-click-modal="false" :close-on-press-escape='false'
  title="修改商品信息"
  :visible.sync="editDialogVisible"
  width="50%" @close="editDialogClosed()">

  <el-form :model="editForm" :rules="editGoodsRules" ref="editFormRef" label-width="70px">

 <el-form-item label="商品名称" prop="goods_name" >
    <el-input disabled v-model="editForm.goods_name"></el-input>
  </el-form-item>
    
  <el-form-item label="商品价格" type="number" prop="goods_price">
    <el-input v-model="editForm.goods_price"></el-input>
  </el-form-item>

    <el-form-item label="商品数量"  type="number" prop="goods_number">
    <el-input v-model="editForm.goods_number"></el-input>
  </el-form-item>

  <el-form-item label="更新时间" type="number" prop="">
    <el-input  disabled v-model="editForm.add_time"></el-input>
  </el-form-item>

</el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
  </span>

</el-dialog>

   </div>

</template>

<script>


export default {


  data() {
  
    return {

      goodsList:[],
      queryInfo:{
 query:'',
pagenum:1,
pagesize:6
      },
total:0,
    //编辑
    editForm:[],
    editDialogVisible:false,
    editGoodsRules:{
     goods_name:
  [ { required: true, trigger: 'blur', message: '请输入' }],
     goods_price:
  [ { required: true, trigger: 'blur', message: '请输入' },
           ],
goods_number:
 [ { required: true, trigger: 'blur', message: '请输入' },
            ]
    }



   
      }
    },


    
  created() {
this.getGoodsList()
  },
  mounted() {

  },
  destroyed() {
   
  },
  methods: {

    //商品列表

 async getGoodsList(){
 const {data:res}=await this.$http.get('/goods',{params:this.queryInfo}) 
if(res.meta.status!==200)
  return this.$message.error('获取商品列表失败')

this.goodsList=res.data.goods
// console.log(this.goodsList)
this.pagenum=res.data.pagenum
this.total=res.data.total
 },
 //分页功能 
handleSizeChange(newSize){
this.queryInfo.pagesize=newSize;
this.getGoodsList();
},

handleCurrentChange(newSize){
this.queryInfo.pagenum=newSize;
this.getGoodsList();
},

   //添加商品
   addGoods(){
this.$router.push('/goods/add')

   },
   //删除商品
   async delDialog(id) {
      const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      
        }).catch(err=>{
          return err
   
      })
       
        if(confirmResult!=='confirm'){
          return   this.$message.info('已取消删除')
        }
        const {data:res}=await this.$http.delete('goods/'+id)
        if(res.meta.status!==200){
          return this.$message.error('删除商品失败')
        }
       this.$message.success('删除商品成功')
     this.getGoodsList();
      },

//编辑修改商品


//点击编辑弹出对话框
async editGoods(id){
const {data:res}=await this.$http.get('/goods/'+id)

   if(res.meta.status!==200){
    return    this.$message.error('查询商品失败')
      }

       this.editDialogVisible=true
       this.editForm=res.data


},
editDialogClosed(){
  this.$refs.editFormRef.resetFields();
},

//点击确定修改完成
    editGoodsInfo(){
  this.$refs.editFormRef.validate(async valid=>{
  if(!valid) return;
    this.editForm.add_time=Date.parse(new Date())/1000
          console.log(this.editForm.add_time)
        const {data:res}= await 
        this.$http.put('/goods/'+ this.editForm.goods_id,
          this.editForm
        )
        if(res.meta.status!==201){
          this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
         this.editDialogVisible=false

       
    
         
         this.getGoodsList()

})

    }



 }
}
</script>

<style lang="less" scoped="" type="">


</style>

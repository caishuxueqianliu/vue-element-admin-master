<template>

  <div >

   <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item >订单列表</el-breadcrumb-item>
</el-breadcrumb>

<el-card>
<el-row :gutter="20">
  <el-col :span="8">
    <!-- 搜索框 -->
 <el-input placeholder="请输入内容"  @clear="getOrdersList()" clearable
  v-model="queryInfo.query" class="input-with-select"> 
    <el-button slot="append" icon="el-icon-search" @click="getOrdersList()"></el-button>
  </el-input>
  </el-col>

</el-row>

<!-- 表格区域 -->

<el-table
      :data="ordersList" stripe border>
       <el-table-column
       type='index'>
      </el-table-column>

     <el-table-column  width="100" label="查看/修改"> 
       <template slot-scope='scope'>
   <el-tooltip  class="item" effect="dark" content="查看/修改" placement="top">
 <el-button  type="warning" size='small' icon="el-icon-tickets" 
  @click=editGoods(scope.row.order_id) ></el-button>
    </el-tooltip>

</template>
         </el-table-column>


      <el-table-column   width="220"
        prop="order_number"
        label="订单编号">
      </el-table-column>
           <el-table-column
        prop="order_price"  width="100"
        label="订单价格">
      </el-table-column>
            <el-table-column
        prop="pay_status"  width="100"
        label="支付状态">
<template slot-scope="scope">   

   <el-tag v-if="scope.row.pay_status===1">已付款</el-tag>
    <el-tag v-else type="warning">未付款</el-tag>

        

         </template>

      </el-table-column>
            <el-table-column
        prop="is_send"  width="100"
        label="是否发货">
      </el-table-column>
            <el-table-column
        prop="create_time" width="200"
        label="下单时间">
<template slot-scope="scope">          
{{scope.row.create_time |dateFormat}}
         </template>
      </el-table-column>

        <el-table-column
        prop="order_fapiao_title"  width="120"
        label="个人/公司">
      </el-table-column>
                  
    <el-table-column    
        label="操作"     
              width="180px">
              <!-- 作用域插槽 -->
 <template slot-scope='scope'>
 <el-tooltip  class="item" effect="dark" content="修改地址" placement="top">
    <el-button type="primary" size='mini' icon="el-icon-edit" @click=editOders(scope.row.order_id)></el-button>
    </el-tooltip>
   <el-tooltip  class="item" effect="dark" content="查看物流" placement="top">
 
 <el-button type="success"size='mini' icon="el-icon-location-outline"  @click=wl()></el-button>
    </el-tooltip>


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
  title="修改信息"
  :visible.sync="editDialogVisible"
  width="50%" @close="editDialogClosed()">

  <el-form :model="editForm" :rules="editGoodsRules" ref="editFormRef" label-width="70px">

 <el-form-item label="订单编号" prop="order_number" label-width="80px" >
    <el-input disabled v-model="editForm.order_number"></el-input>
  </el-form-item>


  <el-form-item label="订单价格" type="number" label-width="80px" prop="order_price">

    <el-input v-model="editForm.order_price"></el-input>
  </el-form-item>

    <el-form-item label="付款状态" label-width="80px" type="number" prop="pay_status">
    <el-input v-model="editForm.pay_status"></el-input>
  </el-form-item>

  <el-form-item label="是否发货"  label-width="80px" type="number" prop="is_send">
    <el-input   v-model="editForm.is_send"></el-input>
  </el-form-item>

</el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
  </span>

</el-dialog>

 <el-dialog :close-on-click-modal="false" :close-on-press-escape='false'
  title="修改地址"
  :visible.sync="Dialog"
  width="50%" @close="dialogClosed()">

  <el-form :model="form"  ref="formRef" label-width="70px">
<el-form-item label="省市区/县"  >
            
     <el-cascader expand-trigger="hover" :options="cityDate"
     v-model="form.address1">
              </el-cascader>
            </el-form-item>

  <el-form-item label="详细地址" type="number" >
    <el-input   v-model="form.address2"></el-input>
  </el-form-item>

</el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="Dialog = false">取 消</el-button>
    <el-button type="primary" @click="info">确 定</el-button>
  </span>

</el-dialog>

<!-- 快递 -->
 <el-dialog :close-on-click-modal="false" :close-on-press-escape='false'
  title="物流详情"
  :visible.sync="log"
  width="50%" >

  <el-timeline :reverse="reverse">
    <el-timeline-item
      v-for="(activity, index) in kdDate"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>


</el-dialog>




   </div>

</template>

<script>

import cityDate from './citydata.js'
export default {


  data() {
  
    return {
      reverse:true,
      log:false,
     ordersList:[],
      queryInfo:{
 query:'',
pagenum:1,
pagesize:6
      },
total:0,
editForm:[],
    editDialogVisible:false,
    editGoodsRules:{
    order_price:
  [ { required: true, trigger: 'blur', message: '请输入' }],
     order_pay:
  [ { required: true, trigger: 'blur', message: '请输入' },
           ],
  pay_status:
 [ { required: true, trigger: 'blur', message: '请输入' },
            ]
    },
Dialog:false,
form:{
  address1:[],
  address2:'',
  consignee_addr:''
},
kdDate:[],

    cityDate,


        }
    },
    
  created() {
this.getOrdersList()
  },
  mounted() {
  
  },
  destroyed() {
   
  },
  methods: {
    //列表

 async getOrdersList(){
 const {data:res}=await this.$http.get('orders',{params:this.queryInfo}) 
if(res.meta.status!==200)
  return this.$message.error('获取列表失败')

this.ordersList=res.data.goods
// console.log(this.goodsList)
this.pagenum=res.data.pagenum
this.total=res.data.total
 },
 //分页功能 
handleSizeChange(newSize){
this.queryInfo.pagesize=newSize;
this.getOrdersList()
},

handleCurrentChange(newSize){
this.queryInfo.pagenum=newSize;
this.getOrdersList()
},



//编辑修改商品


//点击编辑弹出对话框
async editGoods(id){
const {data:res}=await this.$http.get('orders/'+id)

   if(res.meta.status!==200){
    return    this.$message.error('查询失败')
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
   
      
        const {data:res}= await 
        this.$http.put('orders/'+ this.editForm.order_id,
          this.editForm
        )
        if(res.meta.status!==201){
          this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
         this.editDialogVisible=false

       
    
         
       this.getOrdersList()

})

    },

   async editOders(id){





       this.Dialog=true
    


},

//点击确定修改完成
   async info(){
 
   
      this.form.consignee_addr='this.form.address1'+'this.form.address2'
        const {data:res}= await 
        this.$http.put('orders/'+ this.form.order_id,
          this.form.consignee_addr
        )
        if(res.meta.status!==201){
          this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
         this.Dialog=false

       
    
         
       this.getOrdersList()



    },


dialogClosed(){
  this.$refs.formRef.resetFields();
},

async wl(){

const {data:res}=await this.$http.get('/kuaidi/1106975712662')

   if(res.meta.status!==200){
    return    this.$message.error('查询失败')
      }

       this.log=true
       this.kdDate=res.data

// console.log(this.kdDate)


}






    


 }
}
</script>

<style lang="less" scoped="" type="">


.el-cascader {
  width: 100%;
}

</style>

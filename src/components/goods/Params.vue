<template>

  <div >

  
   <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item >分类参数</el-breadcrumb-item>
</el-breadcrumb>


<el-card>
  <el-alert
    title="注意: 只允许为第三级分类设置相关参数!"
    type="warning"
    show-icon>
  </el-alert>
  <!-- 级联选择器 -->
 
    <!--     options用来指定数据源
        props用来指定配置对象 -->
<!--    <el-cascader expandTrigger="hover"
    :options="parentCateList"
    :props="cascaderProps"
    v-model="selectOptons"
    @change="handleChange"></el-cascader> -->
       <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectOptons" @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>

<!-- 选项卡 -->
<el-tabs v-model="activeName" @tab-click="handleTabClick()">
  <el-tab-pane label="动态参数" name="many">
  <el-button type="primary" :disabled="isBtnDisable" @click='add()'>添加参数   
</el-button>
<el-table
    :data="actionData"
    border 
    style="width: 100%">
       <el-table-column
     type="expand"
      width="50">
      <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
     <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                <!-- 输入的文本框 -->
     <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
    </el-table-column>
     <el-table-column
      type="index"
      width="50">
    </el-table-column>
    <el-table-column
      prop="attr_name"
      label="参数名称"
       width="800px">
    </el-table-column>
    <el-table-column  
      label="操作">
       
    <template  slot-scope='scope'>
 <el-button type="primary" size='mini' icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
 <el-button type="danger"size='mini' icon="el-icon-delete" 
  @click="delCate(scope.row.attr_id)" >删除</el-button>

        </template>
    </el-table-column>
  </el-table>

</el-tab-pane>
  <el-tab-pane label="静态属性" name="only">
  <el-button type="primary" :disabled="isBtnDisable" @click='add()' >添加属性
</el-button>
<el-table
    :data="jtDate"
    border 
    style="width: 100%">
       <el-table-column
     type="expand"
      width="50">
       <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
     <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                <!-- 输入的文本框 -->
     <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
    </el-table-column>
     <el-table-column
      type="index"
      width="50">
    </el-table-column>
    <el-table-column
      prop="attr_name"
      label="参数名称"
      width="800px">
    </el-table-column>
    <el-table-column  
      label="操作">
       
    <template  slot-scope='scope'>
 <el-button type="primary" size='mini' icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
 <el-button type="danger"size='mini' icon="el-icon-delete" 
  @click=delCate(scope.row.attr_id) >删除</el-button>

        </template>
    </el-table-column>
  </el-table>
</el-tab-pane>

  </el-tabs>
</el-card>


<!-- add对话框 -->
<el-dialog :close-on-click-modal="false" :close-on-press-escape='false' @close="addDialogClosed()"
  :title="'添加'+titleText"
  :visible.sync="addDialogVisible"
  width="30%">
<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">

  <el-form-item :label='titleText' prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addSave()">确 定</el-button>
  </span>
</el-dialog>

<!-- 修改参数的对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>



   </div>
</template>

<script>


export default {


  data() {
  
    return {
  
   parentCateList:[],
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },  
      selectOptons:[],
activeName:"many",
actionData:[],
jtDate:[],
    addForm: {
        attr_name: ''
      },
  addFormRules:{
      attr_name: 
   [{ required: true, message: '请输入名称', trigger: 'blur' }]
        
      },
      addDialogVisible:false,
         // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改的表单数据对象
      editForm:[],
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    




}

    
    },
    
    
  created() {
this.getParentCateList()
  },
  mounted() {
  
  },
  destroyed() {
   
  },
  methods: {
  
//获取父级分类的列表
async getParentCateList(){
  
    const {data:res}=await this.$http.get('categories',{
        params:{type:3}
       })
        if(res.meta.status!==200){
    return    this.$message.error('获取父级分类列表失败')
      }

       this.parentCateList=res.data
    

},
handleChange(){
  
 
       // console.log(this.selectOptons)
   
     // console.log(res.data)
 this.getDate()

  
       
},
async getDate(){
       if (this.selectOptons.length !==3) {
     this.selectOptons=[]
      this.actionData = []
        this.jtData = []
      return
        }
  const {data:res}=await 
   this.$http.get(`categories/${this.cateId}/attributes`,{
        params:{sel:this.activeName}
       })
        if(res.meta.status!==200){
    return    this.$message.error('获取列表失败')
      }
          res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      // console.log(res.data)
             if(this.activeName==='many'){
      this.actionData=res.data
    }
    else{
      this.jtDate=res.data
    }

},
handleTabClick(){
        this.getDate()
},

// add功能
addDialogClosed(){


this.$refs.addFormRef.resetFields();
   this.addForm={}  

},
add(){
  this.addDialogVisible=true
},
addSave(){


   this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
         
      
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {attr_name:this.addForm.attr_name,
            attr_sel:this.activeName}
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加成功！')
         

        this.addDialogVisible = false

        this.getDate()
      })
},
 // 点击按钮，展示修改的对话框
    async showEditDialog(attr_id) {
      // 查询当前参数的信息
      // console.log(attr_id)
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败！')
      }

      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 重置修改的表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，修改参数信息
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }

        this.$message.success('修改参数成功！')
        this.getDate()
        this.editDialogVisible = false
      })
    },

   //删除功能
  async delCate(attr_id){

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
          const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )
        if(res.meta.status!==200){
          return this.$message.error('删除分类失败')
        }
       this.$message.success('删除分类成功')
        this.getDate()
    },
// 文本框失去焦点，或摁下了 Enter 都会触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return，则证明输入的内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 需要发起请求，保存这次操作
      this.saveAttrVals(row)
    },
    // 将对 attr_vals 的操作，保存到数据库
    async saveAttrVals(row) {
      // 需要发起请求，保存这次操作
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }

      this.$message.success('修改参数项成功！')
    },
    // 点击按钮，展示文本输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  







},
 computed:{
  isBtnDisable(){
    if(this.selectOptons.length!==3){
      return true
    }
    return false
  },
  cateId(){
      if(this.selectOptons.length==3){
      return this.selectOptons[2]
    }
    return null 
 },
 titleText(){

    if(this.activeName==='many'){
      return '动态参数'
    }
     return '静态属性'

 }

}



}

</script>

<style lang="less" scoped="" type="">

.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}
</style>

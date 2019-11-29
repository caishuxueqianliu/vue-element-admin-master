<template>

	


<el-container>
		
  <el-header>
<div>
 <img src="../assets/icon.png" alt="">
 <span>Vue后台管理系统</span>
  </div>
  	<el-button type='info' @click='logout'>退出</el-button></el-header>
  <el-container>

    <el-aside :width="isCollapse?'64px':'200px'">
    	<div class='toggle-button'@click='collapse()'>|||</div>
<el-menu background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b"
      :unique-opened='true'
      :collapse="isCollapse"
      :collapse-transition='false'
      :router='true'>

      <el-submenu :index="item.id+' '" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="iconObj[item.id]" class='iconfont'></i>
          <span>{{item.authName}}</span>
        </template>
       
        

          <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"> 
          	<i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
      </el-menu-item>
        </el-submenu>
     
     
    </el-menu>

    </el-aside>

    <el-main>
    	<router-view>
    	
    </router-view>
Main</el-main>
  </el-container>
</el-container>


</template>

<script type="text/javascript">
	export default{
data(){


	return{

menuList:[],
iconObj:{
   '125':'el-icon-info',
     '103':'el-icon-setting',
       '101':'el-icon-goods',
         '102':'el-icon-document',
           '145':'el-icon-location',

   },
   isCollapse:false

	}
},
created(){
	  this.getMenuList();
	},
methods:{
 logout(){

   window.sessionStorage.clear();
   this.$router.push('/login')

 },
  async getMenuList(){
 
  const {data:res} = await this.$http.get('/menus')
 if(res.meta.status==!200) return this.$messsage.error(res.meta.msg)

this.menuList=res.data;
 },
 collapse(){
 	this.isCollapse=!this.isCollapse;
 }


}


	}



</script>




<style lang="less" scoped type="">
.el-container{
	height: 100%;
}
.el-header{
	background-color: #333744;
	display: flex;
	justify-content: space-between;
	padding-left: 0px;
	color: white;
	font: 30px;
	align-items: center;
	> div {
		display: flex;
			align-items: center;
			span{
				margin-left: 15px;
			}
	}

}
.el-aside{
	background-color:#333744;
	.el-menu{
			border-right: none;
		
	}
}
.el-main{
	background-color: white;
}
.iconfont{
	margin-right: 10px;
}
.toggle-button{
	background-color: #4a5064;
	font-size: 10px;
	text-align: center;
	line-height: 24px;
	letter-spacing: 0.2em;
	color:#fff;
	cursor: pointer;
}

	
</style>
<template>
  <div class="bottom-bar">
      <div class="check-content">
      <check-button class="check-button" :is-checked="isSelectAll"  @click.native="checkClick"/>
      <span>全选</span>
      </div>
    <div class="price">
        合计:{{totalPrice}}
    </div>
    <div class="calculte" >
        打钱 :({{checkedLength}})
    </div>

  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'
import {mapGetters} from 'vuex'
export default {
    name:"CartBottomBar",
    components:{
        CheckButton
    },
    computed:{
        ...mapGetters(['cartList']),
        totalPrice(){
            return  '￥' +this.$store.state.cartList.filter(item =>{
                return item.checked
            }).reduce((preValue,item) =>{
                return preValue + item.price * item.count
            },0).toFixed(2)
        },
        checkedLength(){
            return this.cartList.filter(item => item.checked).length
        },
        isSelectAll(){
            if (this.cartList.length === 0) return false
            //1.使用filter
            //return !(this.cartList.filter(item => !item.checked).length)
            //2.使用find
            // return !this.cartList.find(item => !item.checked)
            //let isChecked = false;
            //3.普通遍历
            for (let item of this.cartList){
                if (!item.checked){
                    return false
                }
                
            }
            return true
        }
        
    },
    methods:{
        checkClick(){
            if(this.isSelectAll){//全部选中
                this.cartList.forEach(item => item.checked = false)
            }else{//全部不选中
                this.cartList.forEach(item => item.checked = true)
            }
        },
        calcClick(){
            if(!this.isSelectAll){
                this.$toast.show('请选择购买的商品',2000)
            }
        }
    }
}
</script>

<style scoped>
    .bottom-bar{
        display: flex;
        position: relative;
        height: 40px;
        line-height: 40px;
        
        background-color: #eee;
        font-size: 14px;
        /* bottom: 40px; */     
    }
     .check-content{
        display: flex;
        /* line-height: 40px; */
        align-items: center;
        width: 90px;
        margin-left: 10px
    }
    .check-button{
        width: 20px;
        height: 20px;
        line-height: 20px;
        margin-left: 10px;
        margin-right: 5px;
    }
   .price{
       margin-left: 20px;
       flex: 1;
   }
   .calculte{
       width: 90px;
       background: red;
       color: #fff;
       text-align: center;

   }
</style>
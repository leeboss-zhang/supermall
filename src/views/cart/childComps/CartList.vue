<template>
  <div class="cart-list">
      <scroll class="content">
          <!-- {{cartList}} -->
          <cart-list-item v-for="(item,index) in cartList"  :key="index" :item-info="item"></cart-list-item>
      </scroll>
  </div>
</template>

<script scoped>
    
    import {mapGetters} from 'vuex'
    import Scroll from 'components/common/scroll/Scroll'
    import CartListItem from './CartListItem'
export default {
   
    name:'CartList',
    components:{
        Scroll,
        CartListItem
    },
    computed:{
        ...mapGetters(['cartList'])
    }


}
</script>

<style scoped>
    .cart-list{
        height: calc(100% - 44px - 
        49px - 40px);
    }
    /* .cart{
        height: 100vh;
    } */
    .content{
        height: 100%;
        overflow: hidden;
    }
</style>
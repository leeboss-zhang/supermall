<template>
    <div class="cart">
        <nav-bar class="nav-bar">
            <div slot="center">购物车({{len}})</div>
        </nav-bar>
         <!-- 商品的列表 -->
        <cart-list></cart-list>
        <cart-bottom-bar></cart-bottom-bar>
    </div>

    <!-- 汇总 -->
</template>

<script>
    import NavBar from  'components/common/navbar/NavBar'
    //mapGetters 辅助函数仅仅是将store中的getters映射到局部计算属性
    import {mapGetters} from 'vuex'
    import CartList from './childComps/CartList'
    import CartBottomBar from './childComps/CartBottomBar'
    export default {
        name: "Cart",
        components:{
            NavBar,
            CartList,
            CartBottomBar
        },
        computed:{
          // ...mapGetters(['cartLength','cartList'])
            ...mapGetters({
                len:'cartLength'
            })
        }
    }
</script>

<style scoped>
.nav-bar{
    background-color: var(--color-tint);
    color: #fff;
    font-weight: 700;
}
     .cart{
        height: 100vh;
    } 
</style>

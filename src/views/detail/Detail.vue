<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav" 
        @titleClick="titleClick" 
        ref="nav"        
        />
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
        <!-- <ul>
            <li v-for="item in $store.state.cartList ">{{item}}</li>
        </ul> -->



        <detail-swiper :top-images='topImages'/>
        <detail-base-info :goods="goods"/>
        <detail-shop-info :shop="shop"/>
        <detail-images-info :images-info="detailInfo" @imgLoad="imgLoad"/>
        <detail-param-info ref="params" :param-info="paramInfo"/>
        <detail-comment-info  ref="comment" :comment-info="commentInfo"/>
        <goods-list  ref="recommend" :goods="recommends"/>
        
    </scroll>
    <back-top @click.native='backTop' v-show="isShowBackTop"/>
    <detail-bottom-bar @addToCart='addToCart' />
    <!-- <toast :message="123"/> -->
    </div>
</template>

<script>
    import DetailNavBar from './childComps/DetailNavBar'
    import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
    import DetailSwiper from './childComps/DetailSwiper'
    import DetailBaseInfo from './childComps/DetailBaseInfo'
    import DetailShopInfo from './childComps/DetailShopInfo'
    import Scroll from 'components/common/scroll/Scroll'
    import DetailImagesInfo from './childComps/DetailImagesInfo'
    import DetailParamInfo from './childComps/DetailParamInfo'
    import DetailCommentInfo from './childComps/DetailCommentInfo'
    import GoodsList from 'components/content/goods/GoodsList'
    import DetailBottomBar from './childComps/DetailBottomBar'
    import {imgListenerMixin,backTopMixin} from 'common/mixin'
    import {debounce} from 'common/utils'
    import {mapActions} from 'vuex'

    //import Toast from 'components/common/toast/Toast'


export default {
    name:"Detail",
    components:{
        
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailImagesInfo,
        Scroll,
        DetailParamInfo,
        DetailCommentInfo,
        DetailBottomBar,
        GoodsList,
       // Toast
    },
     mixins :[imgListenerMixin,backTopMixin],
    data(){
        return{
            iid:null,
            topImages:[],
            goods:{},
            shop:{},
            detailInfo: {},
            paramInfo: {},
            commentInfo: {},
            recommends: [],
            themeTopYs:[],
            getThemeTopy:null,
            currentIndex:0,
            
            
        }
    },

    created(){
        this.iid = this.$route.params.id
        getDetail(this.iid).then(res=>{
           // console.log(res);
            //1.获取顶部图片的轮播数据
            const data = res.result
            this.topImages = data.itemInfo.topImages
            //2.获取商品信息
            this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
            //创建店铺信息
            this.shop = new Shop(data.shopInfo)
            //商品的详情数据
            this.detailInfo = data.detailInfo;
            //获取参数信息
            this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
            //取出评论信息
            
            if (data.rate.cRate !==0){
                this.commentInfo = data.rate.list[0]
            }
     })
     getRecommend().then(res =>{
      //   console.log(res);
         this.recommends = res.data.list
     })
     //给getThemeTopy赋值
    this.getThemeTopy = debounce(()=>{
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        console.log(this.themeTopYs)
        this.themeTopYs.push(Number.MAX_VALUE)
    },100)



    },
    destroyed(){
        this.$bus.$off('itemImgLoad',this.itemImgListener)
    },
    mounted(){
        
    },
    methods:{
        //把addcart方法映射进来，就可以直接使用addCart
        ...mapActions(['addCart']),
        imgLoad(){
            this.$refs.scroll.refresh()
            this.getThemeTopy()
        },
        titleClick(index){
            console.log(index)
            this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100)
        },
        //导航条和滑动条联动
        contentScroll(position){
            // console.log(position)
            //位置·为负值
        //length长度为4
        const positionY = -position.y
           let length = this.themeTopYs.length
        //    if (this.currentIndex!=this.$refs.nav.currentIndex)
        //    {
        //        this.currentIndex = this.$refs.nav.currentIndex
        //    }
        //    for (let i = 0; i<length; i++){
        //        if(this.currentIndex!==i && positionY>=this.themeTopYs[i] ){
        //            this.currentIndex = i;
        //            this.$refs.nav.currentIndex = this.currentIndex
        //            console.log(this.currentIndex)
        //        } 
              
        //    }

        for (let i=0; i<length-1;i++){
            if (this.currentIndex!==i && (positionY>=this.themeTopYs[i]&&positionY<this.themeTopYs[i+1])){
                this.currentIndex =i
                this.$refs.nav.currentIndex =this.currentIndex
                console.log(this.currentIndex)
            }
        }
        //是否显示回到顶部
        //    this.isShowBackTop = -position.y > BACK_POSITION 
        this.listenShowBackTop(position)


        },
        addToCart(){
            console.log('加入购物车')
            //1.获取购物车需要展示的信息
            const product = {}
            product.image = this.topImages[0];
            product.title = this.goods.title;
            product.desc = this.goods.desc;
            product.price = this.goods.realPrice;
            product.iid = this.iid;

            this.addCart(product).then(res=>{
                this.$toast.show(res)
            })
            //2.将商品添加到购物车里
            // this.$store.dispatch('addCart',product).then(res=>{
            //     console.log(res)
            // })
            //3.添加到购物车之后的提示
            
        }
    }
}
</script>

<style scoped>
    #detail{
        position:relative;
        z-index: 9;
        background-color: #fff;
        height: 100vh;
    }
    .detail-nav{
        position: relative;
        z-index: 9;
        background-color: #fff
    }
    .content{
        height: calc(100% - 44px - 58px);
    }
    
</style>
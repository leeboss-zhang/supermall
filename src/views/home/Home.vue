<template>
 
  <div id='home'>
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
      <tab-control :title="['流行','新款','精选']" 
      @tabClick="tabClick" 
      ref="tabControl1" 
      class="tab-control" v-show="isTabFixed">
      </tab-control>
    <scroll class="content" ref="scroll" 
    :probe-type="3"
     @scroll="contentScroll" 
     :pull-up-load="true"
     @pullingUp='loadMore'>
    <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
    <recommend-view :recommends="recommends"/>
    <feature-view/>
    <tab-control :title="['流行','新款','精选']" 
    @tabClick="tabClick" 
    ref="tabControl2" >
    </tab-control>
    <!-- <good-list :goods="goods[currentType].list"></good-list> -->
    <good-list :goods="showGoods"></good-list>
    <!-- {{goods}} -->
    </scroll>
    <back-top @click.native='backTop' v-show="isShowBackTop"/>
  </div>

</template>

<script>
  
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'
  import GoodList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
 // import BackTop from 'components/content/backtop/BackTop'
 // import {getHomeMultidata} from "network/home";
  import {debounce} from 'common/utils'
  import {getHomeMultidata,getHomeGoods} from 'network/home'
  import {imgListenerMixin,backTopMixin} from 'common/mixin'
  //import {BACK_POSITION} from 'common/const'

  // import {Swiper,SwiperItem} from 'components/common/swiper'
export default {
  name:'Home',
  components:{
    NavBar,
    TabControl,

    HomeSwiper,
    RecommendView,
    FeatureView,
    GoodList,
    Scroll,
 
  },
  mixins :[imgListenerMixin,backTopMixin],
  data(){
    return{
       banners:[],
       recommends :[],
       goods:{
         'pop':{page:0,list:[]},
         'new':{page:0,list:[]},
         'sell':{page:0,list:[]}
       },
       currentType:'pop',
       
       tabOffsetTop:0,
       isTabFixed:false,
       //切换时记录页面位置 
       saveY:0,
       //itemImgListener
    }
  },
  computed:{
    showGoods(){
      return this.goods[this.currentType].list
    }
  },
    //   destroyed(){
    //   console.log('home destroyed')
    // },
    activated(){
      this.$refs.scroll.scrollTo(0,this.saveY)
      this.$refs.scroll.refresh()
    },
    deactivated(){
      this.saveY = this.$refs.scroll.getScrollY()
      //取消全局事件的监听
      this.$bus.$off('itemImgLoad',this.itemImgListener)
    },
    created(){
    //1.请求多个数据
    this.getHomeMultidata()
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
    //3.监听item中图片加载完成-解决BUG:滑动到最下面时图面还没加载好，加载一半
    },
    // mounted(){
    //   const refresh = debounce(this.$refs.scroll.refresh,200)
    //   //对监听的事件进行保存
    //   this.itemImgListener=()=>{
    //     refresh()
    //   }
    //   this.$bus.$on('itemImageLoad',this.itemImgListener)
    // },

    methods:{
      //事件监听相关的方法
      tabClick(index){
        switch(index){
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }

       if(this.$refs.tabControl1 !== undefined){
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
        }
      },
      // backClick(){
      //   console.log('返回顶部')
      //   this.$refs.scroll.scrollTo(0,0)
      // },
      contentScroll(position){
          //1.判断BackTop是否显示
        //  position.y < 1000
          //this.isShowBackTop = (-position.y) >BACK_POSITION
       this.listenShowBackTop(position)

         // console.log(position)
         //2.决定tabControl是否吸顶(position:fixed)
          this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore(){
        console.log('上拉加载更多');
        this.getHomeGoods(this.currentType)
         this.$refs.scroll.finishPullUp()
      },
      //让‘流行，新款，精选’往上滚动时能固定在上边
      swiperImageLoad(){
        // console.log(this.$refs.tabControl.$el.offsetTop)
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      // 网络请求相关的方法
    getHomeMultidata(){
      getHomeMultidata().then(res =>{
      //console.log(res);
      //this.result = res;
      this.banners = res.data.banner.list;
      this.recommends = res.data.recommend.list
    })
    },
    getHomeGoods(type){
      const page = this.goods[type].page + 1
      getHomeGoods(type,page).then(res =>{
      this.goods[type].list.push(...res.data.list)
      this.goods[type].page += 1
     
    })
    }
    }
}

</script>

<style scoped>
  #home{
    /* padding-top:  44px;  */
    /* 视口 */
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color:#ffff;
    
    /* 在浏览器原生滚动时，不让浏览器跟着滚动 */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }
  /* .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  } */
  /* .content{
     color: aqua; 
    overflow: hidden;
    height: calc(100% - 93px);
    margin-top: 40px;

  } */
  .content{
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    right: 0;
    left: 0;
  }
  .tab-control{
    position: relative;
    z-index: 9;
  }
  /* .fixed{
    position: fixed;
    left: 0;
    right: 0;
    top: 44px;
  } */
</style>
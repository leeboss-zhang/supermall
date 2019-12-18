<template>
  <div class="wrapper" ref="wrapper">
      <div class="content">
          <slot></slot>
      </div>
  </div>
</template>

<script>
    import BScroll from 'better-scroll'
export default {
    name:"Scroll",
    props:{
        probeType:{
            type:Number,
            default:0
        },
        pullUpLoad:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            scroll:null,
            message:'hahaha'
        }
    },

    mounted(){
        this.scroll = new BScroll(this.$refs.wrapper,{
            click:true,
            probeType:this.probeType,
            pullUpLoad:this.pullUpLoad
        })
        // this.scroll = new BScroll('.wrapper',{
        // }
        //滚动监听
        if (this.probeType === 2|| this.probeType===3){
        this.scroll.on('scroll',(position)=>{
            this.$emit('scroll',position)
        //    console.log(position)
        })
        }
        //3.监听上拉事件
     if (this.pullUpLoad){
            this.scroll.on('pullingUp',()=>{
            this.$emit('pullingUp')
            console.log('上拉加载更多')
        })
        }
    },
    
    methods:{
        scrollTo(x,y,time=300){
          this.scroll &&  this.scroll.scrollTo(x,y,time)
        },
        finishPullUp(){
          this.scroll &&  this.scroll.finishPullUp()
        },
        refresh(){
          this.scroll &&  this.scroll.refresh()
        },
        //获取滚动到的位置
        getScrollY(){
            return this.scroll?this.scroll.y:0
            
        }
    }
}
</script>

<style>

</style>
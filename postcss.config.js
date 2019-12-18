module.exports = {
    plugins:{
        autoprefixer:{},
            "postcss-px-to-viewport":{
                viewportWidth:375,//视图宽度
                viewportHeight:667,//视图高度
                unitPrecision:5,//指定px转换为视窗单位值的小数位数
                viewportUnit:'vw',//指定需要转换成的视窗单位，使用vm
                selectorBlackList:['ignore','tab-bar','tab-bar-item'],//指定不需要转换的类
                minPixelValue:1,//小于或等于'1px'不转换为视窗单位
                mediaQuery:false//允许在媒体查询转换'px'
            }



        },
    }

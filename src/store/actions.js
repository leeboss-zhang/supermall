import{ADD_COUNTER,ADD_TO_CART} from './mutations-type'
export default {
    addCart(context,payload){
        //mutations唯一的目的就是修改state中状态
        //mutations中的每个方法尽可能完成的事件比较单一一点
        //1.查找之前数组中是否有该商品
        return new Promise((resolve,reject)=>{
            let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
            //2.判断oldProduct
            if (oldProduct){
                // oldProduct.count += 1
                context.commit(ADD_COUNTER,oldProduct)
                resolve('当前商品数量+1')
            }
            else{
                payload.count =1
                // context.state.cartList.push(payload)
                context.commit(ADD_TO_CART,payload)
                resolve('添加到购物车')
            }
        })
     
   // let oldProduct = null;
        // for (let item of state.cartList){
        //     if(item.iid === payload.iid){
        //         oldProduct = item
        //     }
        // }
       // state.cartList.push(payload)
    }
}
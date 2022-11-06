<template>
  <div id="app">
    <button @click="m1">选择头像</button><br>
    <div id="imgBox">
      <img ref="img" alt="">
    </div>
  </div>
</template>

<script>
import selectAvatars from '../src'
export default {
  name: 'App',
  data() {
    return {
      
    }
  },
  methods:{
    m1(){
      selectAvatars({ // 配置项
        nightMode: true, // 是否为夜间模式
      }).then(data=>{
        console.log('数据：', data)

      }).catch(err=>{ // 错误处理
        switch(err.code){
          case 0 :
            console.log('图片格式错误')
            break;
          case 1 :
            console.log('图片过大')
            break;
        }
      })
    }
  },
}
</script>

<style scoped>
#app{
  width: 100%;
  padding-top: 10%;
}
button{
  margin: 0 auto 30px auto;
  padding: 6px 10px;
  display: block;
}
#imgBox{
  min-width: 100px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  padding: 100px;
}
</style>

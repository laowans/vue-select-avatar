<template>
  <div id="app">
    <button @click="m1">123</button><br>
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
      selectAvatars({
        nghtMode:true,
        maskLayer:true,
      }).then(s=>{
        this.$refs.img.src = s
      }).catch(err=>{
        console.log(err);
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

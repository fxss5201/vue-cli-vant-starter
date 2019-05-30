<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  created () {
    this.$toast.loading({
      duration: 0,
      mask: true,
      forbidClick: true,
      message: '加载中...',
      loadingType: 'spinner'
    })

    setTimeout(() => {
      this.$toast.clear()
    }, 3000)
  }
}
</script>

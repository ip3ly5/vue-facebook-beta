<template>
<div class="main-left">
    
</div>
</template>
<script>
export default {
    name: 'mainLeft',
    data () {
        return {
            msg: 'Welcome to your vue.js app'
        }
    }
}
</script>
<style scoped>

    div.main-left {
      display: grid;
      grid-gap: 1rem;
      position: fixed;
      top: 5rem;
      width: 25vw;
      height: 100vh;
      padding: 0px 1rem;
    }

    div.main-left div.s2 {
      display: grid;
      grid-template-columns: 1fr 100fr;
      grid-gap: 2.4rem;
    }

    div.main-left div.s2 i {
      font-size: 2rem;
    }

    div.main-left div.group {
      display: grid;
      grid-template-columns: 1fr 10fr;
      grid-gap: 1rem;
    }

    div.main-left div.group div.group-name {
      font-weight: 400;
    }
</style>
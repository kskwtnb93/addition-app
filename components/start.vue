<template>
  <router-link tag="p" class="start-button" to="/question">診断スタート</router-link>
</template>

<script>
mode: 'history',
module.exports = {
  data: function() {
    return {
      title: 'TOP'
    }
  }
}
</script>

<style scoped>
.start-button {
  font-size: 1.4rem;
  text-align: center;
  background: #000;
  color: #fff;
  border-radius: 5rem;
  margin: 10rem 5rem;
  padding: .5rem 0;
}
</style>
<template>
  <div class="main-contents">
    <h1 class="headline">{{ title }}</h1>

    <ul class="ranking">
      <li
        class="ranking__item"
        v-if="this.rank.num0"
      >{{ this.rank.num0 }}</li>
      <li
        class="ranking__item"
        v-if="this.rank.num1"
      >{{ this.rank.num1 }}</li>
      <li
        class="ranking__item"
        v-if="this.rank.num2"
      >{{ this.rank.num2 }}</li>
    </ul>

    <router-link tag="p" class="reset-button" to="/question">最初から診断する</router-link>

  </div>
</template>

<script>
module.exports = {
  data: function() {
    return {
      title: '診断結果',
      rank: {}
    }
  },
  created: function() {
    if(this.$route.query.num0) {
      this.rank['num0'] = this.$route.query.num0
    }

    if(this.$route.query.num1) {
      this.rank['num1'] = this.$route.query.num1
    }

    if(this.$route.query.num2) {
      this.rank['num2'] = this.$route.query.num2
    }

    // for(let i = 0; i < 3; i++) {
    // }
    console.log(this.rank)
  }
}
</script>

<style scoped>
.main-contents {
  padding: 5rem 0 0;
}
.headline {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2.5rem;
}
.ranking {
  display: inline-block;
  margin-bottom: 3rem;
}
.reset-button {
  font-size: 1.4rem;
  text-align: center;
  background: #000;
  color: #fff;
  border-radius: 5rem;
  margin: 0 5rem;
  padding: .5rem 0;
}
.ranking__item {
  font-size: 1.6rem;
  font-weight: normal;
  text-align: left;
  margin-bottom: 1rem;
}
.ranking__item:nth-child(1)::before {
  content: 'ポイント1位： ';
}
.ranking__item:nth-child(2)::before {
  content: 'ポイント2位： ';
}
.ranking__item:nth-child(3)::before {
  content: 'ポイント3位： ';
}
</style>
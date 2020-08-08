<template>
  <div id="app">

    <div class="nav-box">
      <div class="logo" @click="goFristPage">项目练习</div>
      <div class="nav-list">
        <router-link to="/home">首页</router-link>
        <router-link to="/learn">课程学习</router-link>
        <router-link to="/student">学员展示</router-link>
        <router-link to="/about/">关于</router-link>
        <router-link to="/activity">社区</router-link>
      </div>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
  methods: {
    goFristPage() {
      console.log(this.$router);
      this.$router.push('/home');
      console.log(this.$route);
    },
  }
}
</script>

<style scoped>
.nav-box {
  display: flex;
  justify-content: space-between;
  height: 60px;
  line-height: 60px;
  background-color: #3385ff
}

.nav-box .logo {
  color: #fff;
}

.nav-list a {
  margin-left: 40px;
  color: #fff;
  text-decoration: none;
}

 a.router-link-active {
  font-weight: bold;
  color: rgb(31, 23, 143);
  font-size: 24px;
}

.container {
  margin-top: 60px;
}

.nav-box,
.container {
  padding-left: 200px;
  padding-right: 200px;
}
</style>
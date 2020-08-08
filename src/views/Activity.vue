<template>
  <div class="activity">
    <router-link to='/activity/study'>学术讨论</router-link>
    <router-link to='/activity/personal'>个人中心</router-link>
    <router-link :to="{name: 'download'}">资源下载</router-link>
    <div class="sonRoute">
      子路由内容：
      <router-view></router-view>
    </div>
  </div>
</template>
<style scoped>
.activity .sonRoute{
  padding: 20px 0;
}
a {
  margin-right: 10px;
  padding: 5px 10px;
  text-decoration: none;
}
a.router-link-exact-active {
  background-color: #3385ff;
  color: #fff;
}
.activity-view {
  margin-top: 40px;
  padding-left: 10px;
}
</style>
<template>
  <div>
    <ul>
      <li v-for="item in questionList" :key="item.id" @click="getDetail(item.id)"
        style='cursor: pointer;'
      >{{ item.title }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      questionList: [],
    };
  },
  methods: {
    getDetail(id) {
      this.$router.push({
        path: `/question/${id}`,
      });
    },
  },
  mounted() {
    this.$axios.get("/question").then((resp) => {
      this.questionList = resp.data;
      console.log(this.questionList, "this.questionList");
    });
  },
};
</script>

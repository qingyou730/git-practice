<template>
  <div>
    <retained-time></retained-time>
  </div>
</template>

<script>
  import timer from '@/components/base/timer'
  import single from '@/components/base/single'
  import linkageSingle from '@/components/base/linkage_single'
  import eventGroup from '@/components/base/event_group'
  import userWhere from '@/components/base/user_where'
  import eventWhere from '@/components/base/event_where.vue'
  import AnalyzeObject from '@/components/base/analyze_object'
  import moduleLinkage from '@/components/base/module_linkage.vue'
  import attrGroup from '@/components/base/attr_group.vue'
  import eventIndicators from '@/components/base/event_indicators.vue'
  import retainedEvent from '@/components/base/retained_event.vue'
  import retainedTime from '@/components/base/retained_time.vue'
  export default {
    components: {
      moduleLinkage,
      timer: timer,
      single: single,
      userWhere: userWhere,
      linkageSingle: linkageSingle,
      eventGroup: eventGroup,
      AnalyzeObject: AnalyzeObject,
      attrGroup:attrGroup,
      eventWhere,
      eventIndicators,
      retainedEvent,
      retainedTime
    },
    name: 'list',
    data() {
      return {
        ab: {},
        c : '' ,
        msg: '/system/menu/list'
      }
    },
    methods: {
      change: function() {
        console.log(this.ab);
      }
    },
    watch: {
      c: {
        handler: function(val, oldval) {
          console.log(this.c);
          console.log(this.$store.state.module_linkage) ;
        },
        deep: true //对象内部的属性监听，也叫深度监听
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>

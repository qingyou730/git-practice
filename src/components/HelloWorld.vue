<template>
  <div class="my-form-row">
    <span class="my-form-label">{{title}} :</span>
    <div style="display: inline-block;">
      <div v-for="(step,index) in steps" :key="index" class="my-form-row">
        <!-- <el-input v-model="step.alias" placeholder="请给指标取一个名字" style="width: 180px;" /> -->
        <el-cascader placeholder="输入可搜索" :props="prop"  filterable v-model="step.eventGroupValue"
          :ref="'node_attr_' + step.id" @change="change_event($event,step)">
        </el-cascader>
        <!-- <el-select v-model="step.agg_value" v-if="step.options.agg_selections.length > 0" @change="aggValueChanged(step)">
          <el-option v-for="item in step.options.agg_selections" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select> -->
        <el-button @click="remove_step()" type="primary" icon="el-icon-minus" circle size="mini" class="root-add-btn"></el-button>
        <el-dropdown placement="bottom">
          <el-button type="primary" icon="el-icon-plus" circle size="mini"></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="add_main_step()">事件指标</el-dropdown-item>
            <el-dropdown-item @click.native="add_step(step)">子条件</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <event-indicators-tree :attr_type="attr_type" :url_list="url_list" :options="options" :parent="step"
          :step_children="step.step_children" :step_logic="step.step_logic" :add_step="add_step"
          :event_id="step.event_id"
          :is_object_behavior = "step.is_object_behavior"
          >
        </event-indicators-tree> -->
      </div>
    </div>
  </div>

</template>
<script>
  import eventIndicatorsTree from '@/components/base/event_indicators_tree';
  export default {
    components: {
      eventIndicatorsTree: eventIndicatorsTree
    },
    props: ["title", "name", "moduleId", "apis", "value"],
    created() {
      // var url_list = {};
      // for (var v of this.apis) {
      //   url_list[v.name] = v.api;
      // }
      // this.url_list = url_list;
      if(this.value){
        this.steps = this.value ;
        this.options.is_edit = true ;
      }
    },
    data() {
      return {
        load:0,
        id_count: Date.parse(new Date()) ,
        msg: '/content/category/add',
        options: {
          is_edit:false ,
          attr_list: [], //一级属性列表
          agg_selections: [],
          list_value: {}, //各个对象的建议值
          op_map: {},
          op_field_map: {}
        },
        domain: {
          value: '',
          id: '',
          agg_value: ''
        },
        event_id: 1,
        attr_type: '', //OBJECT_DAY-区间   //OBJECT_RANGE-每日
        steps: [{
          "id": 1,
          "fid": 0,
          "level": 0,
          'step_logic': 'AND',
          'logic_op': 'AND',
          'step_children': [],
          'condition_children': [],
          'agg_value': '',
          'eventGroupValue': '',
          // 'alias': '',
          options: {
            agg_selections: [],
            event_list: []
          }
        }],
        url_list: {
          url_attr: '/mmp/model/event/analyze_filter_attr/', //属性列表接口
          url_sub_attr: '/mmp/model/event/analyze_filter_sub_attr/', //子级事件接口地址

          url_op: '/mmp/model/base/operation/', //操作符列表下拉框的接口地址
          url_list_value: '/mmp/model/base/attr_dimensions/', //建议值
          url_range_list: '/mmp/model/base/range_attr_list/', //区间操作符接口地址
          
          url_event_group: '/mmp/model/event/event_groups',
          multistage_events: '/mmp/model/event/multistage_events',
          
          url_aggregation_function: '/mmp/model/base/functions'
        },
        prop: { //级联菜单的选项
          label: 'name', //指定label字段用哪个
          lazy: true, //是否懒加载
          lazyLoad: ((node, resolve) => {
            if (node.root) {
              var url_event_group = this.url_list.url_event_group;
              var param = this.$generateParams(this.$store.state.linkage);
              this.axios.post(url_event_group, param).then(response => {
                var data = response.data;
                if (data.code != 200) {
                  this.$error("接口请求失败-user-where-6");
                  return;
                }
                var attr_list = data.data[0].child
                attr_list.map((v) => {
                  v.leaf = !v.cascade;
                  v.level = level + 1 ;
                });
                resolve(attr_list);
              }).catch((errors) => {
                console.log(errors)
                this.$error("接口请求失败-user-where-1");
              });
              return ;
            }
            const parent = node.data;
            var level = node.level;
            var is_object_behavior = false;
            if (parent != null) {
              if (parent.hasOwnProperty("is_object_behavior") && parent.is_object_behavior) {
                is_object_behavior = true;
              }
              var step_attr = ['', 'event_group', 'event_id', 'attr'];
              var behavior_step_attr = ['', 'object_behavior', 'behavior_final_attr'];

              var param = {
                object: "role",
                property_type: parent.value,
                attr_type: is_object_behavior ? 'OBJECT_BEHAVIOR' : 'EVENT',
                step_attr: is_object_behavior ? behavior_step_attr[level] : step_attr[level],
              }
              var param = this.$generateParams(param);
              var event_sub_list = this.url_list.multistage_events;

              //获取一级属性列表
              this.axios.post(event_sub_list, param).then((response) => {
                var data = response.data;
                if (data.code != 200) {
                  this.$error("接口请求失败-user-where-tree-sub-child");
                  return;
                }
                var children = data.data;
                children.map((v) => {
                  v.leaf = !v.cascade;
                  v.level = level + 1;
                })
                resolve(children);
              }).catch((errors) => {
                console.log(errors)
                this.$error("接口请求失败-user-where-tree-sub-child");
              });
            }
          })
        }
      }
    },
    methods: {
      test() {
        // console.log(this.where)
      },
      remove_node(parent, index) { //删除树节点
        parent.splice(index, 1);
      },
      add_step: function(node) {
        if (node.step_children.length >= 4) {
          this.$error("事件限制四个");
          return;
        }
        var first_compare_op = this.options.agg_op_map[0];
        var step = {
          // 'alias': '',
          "fid": node.id,
          'logic_op': 'AND',
          'step_type': 'event',
          "is_group": false,
          "level": node.level + 1,
          "id": this.id_count++,
          'cascade': false,
          'value_array': [],
          'name_array': [],
          'value': '',
          'op': '',
          'field_name': '',
          'field_type': '',
          'op_name': '',
          "need_op": false,
          "list_value": '',
          'left': '',
          "right": '',
          "in": [],
          "box_type": '',
          "step_children": [],
          "type": "STATIC",
          "fast_name": "",
          "fast": "",
          "range_attr": '',
          "range_attr_name": '',
          'is_object_behavior':false,
          'event_id':'',
          "options": node.options
        };
        node.step_children.push(step);
      },
      change_event(value, node) {
        console.log(value, node, 'value node===')
        var checked_node = this.$refs['node_attr_' + node.id][0].getCheckedNodes();
        var node_data = checked_node[0].data;
        var node_type = node_data.field_type;
        var temp_select_options = checked_node[0].pathNodes;
        var select_options = [];
        temp_select_options.map((v) => {
          select_options.push(v.data);
        })

        if (this.options.agg_op_field_map.hasOwnProperty(node_type)) {
          node.options.agg_selections = this.options.agg_op_field_map[node_type];
          this.$set(node, 'agg_value', node.options.agg_selections[0].value);
          node.agg_name = node.options.agg_selections[0].name;
        } else {
          node.options.agg_selections = [];
        }

        var name_array = [];
        for (var i in select_options) {
          if (select_options[i].hasOwnProperty('name')) {
            name_array.push(select_options[i].name);
          }
        }
        var finnal_option = select_options[select_options.length - 1];

        node.name_array = name_array;
        node.field_type = finnal_option.field_type;
        node.list_value = finnal_option.list_value;
        node.field_name = finnal_option.name;

        const parent = checked_node[0].data;
        var level = 0;
        var event_id = value[1];
        var is_object_behavior = false;
        if (parent != null && parent.hasOwnProperty("is_object_behavior") && parent.is_object_behavior) {
          is_object_behavior = true;
        }
        var step_attr = 'event_id';
        var behavior_step_attr = 'behavior_final_attr';
        var param = {
          object: "role",
          property_type: parent == null ? "" : event_id,
          attr_type: is_object_behavior ? 'OBJECT_BEHAVIOR' : 'EVENT',
          step_attr: is_object_behavior ? behavior_step_attr : step_attr,
        }
        node.event_id = event_id ;
        node.is_object_behavior = is_object_behavior ;

        node.step_children = []
      },
      add_main_step() {
        var step = {
          "id": ++this.event_id,
          "fid": 0,
          "level": 0,
          'step_logic': 'AND',
          'logic_op': 'AND',
          'step_children': [],
          'condition_children': [],
          'name_array': [],
          'agg_value': '',
          'eventGroupValue': '',
          // 'alias': '',
          "options": {
            agg_selections: [],
            event_list: []
          }
        };
        this.steps.push(step)
      },
      remove_step(node) {
        var index = this.steps.indexOf(node)
        if (this.steps.length > 1) {
          this.steps.splice(index, 1);
        }
      },
      aggValueChanged(node, val) {
        let obj = {};
        obj = node.options.agg_selections.find((item) => {
          return item.value === node.agg_value;
        });
        node.agg_name = obj.name;
      }
    },
    watch: {
      steps: {
        handler: function(val, oldval) {
          this.$emit('input', this.steps);
        },
        immediate: true,
        deep: true, //对象内部的属性监听，也叫深度监听
      },
    },

    mounted() {
      // 一级下拉列表值的接口地址
      var url_attr = this.url_list.url_attr;
      //子级属性接口地址
      var url_sub_attr = this.url_list.url_sub_attr;
      //操作符列表下拉框的接口地址
      var url_op = this.url_list.url_op;
      //建议值
      var url_list_value = this.url_list.url_list_value;
      //区间操作符接口地址
      var url_range_list = this.url_list.url_range_list;
      var url_event_group = this.url_list.url_event_group;
      var url_aggregation_function = this.url_list.url_aggregation_function;
      var param = this.$generateParams(this.$store.state.linkage);

      this.axios.post(url_aggregation_function, param).then(response => {
        var data = response.data;
        if (data.code != 200) {
          this.$error("接口请求失败-user-where-6");
          return;
        }
        var op_list = data.data
        var op_map = this.$tools.list2map(op_list, 'value');
        var op_field_map = this.$tools.regroup_op(op_list);
        this.options.agg_op_map = op_map;
        this.options.agg_op_field_map = op_field_map;
      }).catch((errors) => {
        console.log(errors)
        this.$error("接口请求失败-user-where-1");
      });

      //获取操作符列表接口
      this.axios.post(url_op, param).then((response) => {
        var data = response.data;
        if (data.code != 200) {
          this.$error("接口请求失败-user-where-4");
          return;
        }
        var op_list = data.data
        var op_map = this.$tools.list2map(op_list, 'value');
        var op_field_map = this.$tools.regroup_op(op_list);
        var box_type_map = this.$tools.list2f1f2(op_list, 'value', 'box_type');
        this.options.op_map = op_map;
        this.options.op_field_map = op_field_map;
        this.options.box_type_map = box_type_map;
      }).catch((errors) => {
        this.$error("接口请求失败-user-where-2");
      });

      //获取区间操作符
      this.axios.post(url_range_list, param).then((response) => {
        var data = response.data;
        if (data.code != 200) {
          this.$error("接口请求失败-user-where-5");
          return;
        }
        var temp_range_list = data.data
        var range_attr_field_type_map = this.$tools.list2f1f2(temp_range_list, 'field_type', 'range_op');
        var rane_attr_name_map = {}
        temp_range_list.map((f) => {
          f.range_op.map((v) => {
            rane_attr_name_map[v["value"]] = v["name"];
          })
        })
        this.options.range_attr_field_type_map = range_attr_field_type_map;
        this.options.rane_attr_name_map = rane_attr_name_map;
      }).catch((errors) => {
        console.log(errors)  ;
        this.$error("接口请求失败-user-where-3");
      });


    }
  }
</script>

<style>

</style>

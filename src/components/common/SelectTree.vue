<template>
  <el-popover placement="bottom-start" width="200" @hide="popoverHide" trigger="click" v-model="isShowSelect" class="tree-container"> 
    <el-scrollbar><el-tree
      style="height:300px;"
      class="pop-tree"
      empty-text="暂无数据"
      highlight-current
      v-if="isShowSelect"
      :props="defaultProps"
      :load="loadNode"       
      :data="treeData"
      :node-key="nodeKey"
      :show-checkbox="multiple"
      :expand-on-click-node="multiple"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :default-expand-all="defaultExpandAll"
      @node-click="handleNodeClick"
      @check="getKeys"
      lazy
    ></el-tree>
    </el-scrollbar>
    <div class="trriger" slot="reference">
      <p style="margin-right:10px" v-if="nameText">{{nameText}}:</p>
      <p style="margin-right:4px" v-if="nameText">{{tipText}}</p>
      <div class="iconfont icon-sanjiao"></div>
    </div>
  </el-popover>
  
</template>

<script>
export default {
  props: {
    //多选名称
    nameText: {type:String},
    //数据
    treeData: { type: Array, required: false },
    //是否默认展开所有节点
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    //popover隐藏时触发
    popoverHide: {
      type: Function,
      default: function () { }
    },
    //是否展示选择框、点击节点时展开
    multiple: {
      type: Boolean,
      default: true
    },
    //当有lazy加载时加载子数据的方法
    loadNode: {
      type: Function,
      default: function() {}
    },
    // handleNodeClick:{
    //   type: Function,
    //   default:function() {}
    // },
    //父组件传递过来的数据。。   .sync双向绑定
    id: {type:Array,default: ()=> []},
    //节点唯一标识
    nodeKey: { type: String, default: 'id' },
  },
  data () {
    return {
      // 是否显示树状选择器
      isShowSelect: false,
      // name: [],
      //select选择器值
      key: [],
      tipText:'全部',
      showValueTmp: '',
      //默认展开节点的key数组
      defaultExpandedKeys: [],
      //默认勾选的节点的 key 的数组
      defaultCheckedKeys: [],
      //tree空间配置选项
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  watch: {
    isShowSelect (val) {
      // 隐藏select自带的下拉框
      // this.$refs.select.blur()
      // if(!this.name.length) this.key = []
      if (val) {
        // 下拉面板展开-选中节点-展开节点
        this.setTreeCheckNode(this.key)
        this.defaultCheckedKeys = this.key
        // this.defaultExpandedKeys = this.key
      }
    },
    key () {
      if (this.multiple) {
        this.$emit('update:id', this.key)
      } else {
        this.$emit('update:id', this.key[0])
      }
    }
  },
  mounted () {
    // 把传进来的参数转成数组处理
    if (this.multiple && Array.isArray(this.id)) {
      this.key = this.id
    } else {
      this.key.push(this.id)
    }
    this.setTreeCheckNode(this.key)
  },
  methods: {
    handleNodeClick (data) {
      if (!this.multiple) {
        let tmpMap = {}
        tmpMap.value = data.id
        tmpMap.label = data.name
        this.options = []
        this.options.push(tmpMap)
        this.key = [data.id]
        this.isShowSelect = !this.isShowSelect
      }
    },
    getKeys (data, checked) {
      let tmp = []
      // let name = []
      console.log(data, checked);
      if(checked && checked.checkedNodes &&checked.checkedNodes.length) this.tipText = checked.checkedNodes[0].name
      if(checked && checked.checkedNodes &&checked.checkedNodes.length == 0) this.tipText = '全部'
      let checkedNodes = this._.uniqBy(checked.checkedNodes,'id')
      checkedNodes.forEach(node => {
        let tmpMap = {}
        tmpMap.value = node.id
        tmpMap.label = node.name
        tmp.push(tmpMap)
      })
      // this.name = name
      this.options = tmp
      this.key = checked.checkedKeys
    },
    setTreeCheckNode (ids) {
      let tmp = []
      ids.forEach(id => {
        this.findTreeNode(this.treeData, id)
        tmp.push(this.showValueTmp)
      })
    },
    // 递归查询树形节点
    findTreeNode (tree, id) {
      if(tree && tree.length) {
        for (var i = 0; i < tree.length; i++) {
          if (tree[i].id === id) {
            this.showValueTmp = tree[i].name
          } else if (tree[i].children != null && tree[i].children.length > 0) {
            this.findTreeNode(tree[i].children, id)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-container /deep/ {
  .trriger {
    height: 24px;
    // width: 40px;
    display: flex;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
    p {
      font-size:12px;
      color: #444853;
      white-space: nowrap;
      display: block;
      margin-right: 10px;
    }
  }
}

</style>

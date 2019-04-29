<template>
  <el-popover placement="bottom-start" width="200" @hide="popoverHide" trigger="click" v-model="isShowSelect" class="tree-container"> 
    <el-tree
      style="height:300px;"
      class="pop-tree"
      v-if="isShowSelect"
      :data="treeData"
      :node-key="nodeKey"
      :show-checkbox="multiple"
      :expand-on-click-node="multiple"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :default-expand-all="defaultExpandAll"
      highlight-current
      @node-click="handleNodeClick"
      @check="getKeys"
      :props="defaultProps"
      :load="loadNode"
      lazy
    ></el-tree>
    <el-select slot="reference" ref="select" v-model="name"  :multiple="multiple" :placeholder="tipText" @click.prevent="changeShow" :size="size">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label"></el-option>
    </el-select>
  </el-popover>
  
</template>

<script>
export default {
  props: {
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
    size:{
      type: String,
      default: 'mini'
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
    id: [String, Array],
    //节点唯一标识
    nodeKey: { type: String, default: 'id' },
    //默认文字
    tipText: { type: String, default: '请选择' }
  },
  data () {
    return {
      // 是否显示树状选择器
      isShowSelect: false,
      //select选项
      options: [],
      //select选择器值
      key: [],
      name:[],
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
      this.$refs.select.blur()
      if(!this.name.length) this.key = []
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
    changeShow() {
      // if(!this.isShowSelect)  this.isShowSelect=true
      this.isShowSelect = !this.isShowSelect
    },
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
      if(checked && checked.checkedNodes &&checked.checkedNodes.length) this.name = [checked.checkedNodes[0].name]
      if(checked && checked.checkedNodes &&checked.checkedNodes.length == 0) this.name =[]
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
  .el-input--mini .el-input__inner {
    height: 28px!important;
  }
  .el-select {
    .el-select__tags {
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      .el-tag--info {
        width: 100%;
        // position: relative;.
        display: flex;
        .el-select__tags-text {
          width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .el-icon-close {
          margin: auto;
        }
      }
    }
  }
}

</style>

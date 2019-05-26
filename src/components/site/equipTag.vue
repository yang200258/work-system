<template>
    <div class="tag-container">
        <p :class="type === 0 ? 'add' : 'delete'">{{device.name}}-{{device.type == 0 ? '蓝牙设备' : 'WIFI设备'}}</p>
        <el-button size="mini" type="success" @click.prevent="$emit('add',device)" v-if="type === 0">添加 >></el-button>
        <el-button size="mini" type="danger" @click.prevent="$emit('delete',device)" v-if="type === 1">删除</el-button>
    </div>
</template>


<script>
export default {
    props: {
        device: {type:Object},
        type: {type: Number,default: 0}
    },
    data() {
        return {

        }
    }
}
</script>


<style lang="scss" scoped>
    .tag-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        border-bottom: 1px dashed #ccc;
        max-width: 400px;
        width: 300px;
        p {
            max-width: 70%;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
            font-family: 'PingFangSC-Regular', 'PingFang SC';
            color: #67C23A;
            white-space: nowrap;
        }
        .el-button {
            margin-left: 20px;
        }
        .add {
            color: #67C23A;
        }
        .delete {
            color: #409EFF;
        }
    }
</style>
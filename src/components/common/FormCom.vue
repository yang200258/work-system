<template>
    <div class="form-container">
        <div class="form-wrappe" v-for="(item,i) in formData" :key="i">
            <my-input v-if="item.type === 'input'" :placeholder="item.placeholder" :inputData="item.inputData" :size="size"></my-input>
            <select-tree></select-tree>
        </div>
    </div>
</template>

<script>
import MyInput from './MyInput'
import SelectTree from './SelectTree'
export default {
    props: {
        formData: {type: Array},
        size: {type: String}
    },
    components: {MyInput,SelectTree},
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
    .form-container {

    }
</style>

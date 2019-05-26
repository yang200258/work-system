<template>
    <div class="infotag-container">
        <div class="infotag-left">
            <span>{{data.text}}</span>
        </div>
        <div class="infotag-right">
            <slot name="info-tag">{{data.info}}</slot>
        </div>
        <el-divider></el-divider>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
    .infotag-container {

    }
</style>

<template>
    <div class="edit-group-container">
        <option-group :status="'edit'" @changeName="changeName"></option-group>
    </div>
</template>

<script>
import OptionGroup from '@/components/checkgroup/optionGroup'
export default {
    data() {
        return {
            name: ''
        }
    },
    mounted() {
        this.name = this.$route.params.name
    },
    methods: {
        changeName: function(val) {
            this.name = val
        }
    },
    components: {
        OptionGroup
    }
}
</script>


<style lang="scss" scoped>
.edit-group-container {
    
}
</style>

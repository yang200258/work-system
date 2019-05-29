<template>
    <div class="create-group-container">
        <option-group :status="'new'" :name="name"></option-group>
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
    components: {
        OptionGroup
    }
}
</script>


<style lang="scss" scoped>
.create-group-container {
    
}
</style>

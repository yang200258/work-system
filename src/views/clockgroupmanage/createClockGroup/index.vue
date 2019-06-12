<template>
    <div class="create-group-container">
        <option-group :status="'new'"></option-group>
    </div>
</template>

<script>
import OptionGroup from '@/components/checkgroup/optionGroup'
export default {
    data() {
        return {
            
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

<template>
    <div class="edit-group-container">
        <option-group :status="'edit'" :name="'海南大厦26层-9点至17点30分'"></option-group>
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
.edit-group-container {

}
</style>

<template>
    <div class="check-container"> 
        <option-site :optionSiteId="optionSiteId"></option-site>
    </div>
</template>

<script>
// import {mapState,mapMutations} from 'vuex'
import OptionSite from '@/components/site/optionSite'
export default {
    data() {
        return {
            officeId: null,   //添加后的考勤地点ID
            optionSiteId: 0
        }
    },
    components: {
        OptionSite
    }
}
</script>

<style lang="scss" scoped>
    .check-container {
        padding: 0 40px;
        display: flex;
        flex-direction: column;
        .footer {
            display: flex;
            justify-content: center;
            margin: 40px 0;
        }
    }
</style>

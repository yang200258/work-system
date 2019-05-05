<template>
    <div class="checkgroup-container">
        <el-form :model="groupInfo" label-position="right" label-width="100px">
            <el-form-item label="考勤组名称" prop="name">
                <el-input size="small" v-model="groupInfo.name" placeholder="如未填写，系统会通过地点、班次类型自动填写（固定班次填时间，排班填“排班制”）"></el-input>
            </el-form-item>
            <el-form-item label="考勤组组员" prop="users" class="group-user">
                <el-input type="textarea" size="small" v-model="groupInfo.users"></el-input>
                <el-button type="primary" size="mini">编辑组员</el-button>
            </el-form-item>
            <el-form-item label="考勤地点" prop="site">
                <el-button type="primary" size="small" icon="el-icon-edit">添加</el-button>
                <div class="site">

                </div>
            </el-form-item>
            <el-form-item label="班次类型" prop="workType">
                <el-radio-group v-model="groupInfo.workType">
                    <el-radio :label="1">固定班次</el-radio>
                    <el-radio :label="2">排班制</el-radio>
                </el-radio-group>
            </el-form-item>
            <div class="worktype-container">
                <div class="fix" v-if="groupInfo.workType === 1">
                    <div class="time">
                        <el-form-item prop="worktime" label="工作时间段">
                            <time-tag> </time-tag>
                        </el-form-item>
                    </div>
                </div>
                <div class="scedul" v-if="groupInfo.workType === 2">

                </div>
            </div>
        </el-form>
    </div>
</template>


<script>
import TimeTag from '@/components/checkgroup/timeTag'

export default {
    data() {
        return {
            groupInfo:{name: '',users: '',site: [],workType:1,worktime:[{value: ''}]},
            worktime:[{value: ''}]
        }
    },
    components: {
        TimeTag
    }
}
</script>


<style lang="scss" scoped>
$leftWidth:80px;
    .checkgroup-container {
        width: 70%;
        .group-user {
            position: relative;
            .el-button {
                background-color: #CBEBF8;
                color: #3366FF;
                border: none;
                position: absolute;
                right: -100px;
                top: 0;
            }
        }
        .worktype-container {
            font-size: 14px;
            color: #606266;
            margin-left: $leftWidth;
            .fix {
                
            }
        }
    }
</style>

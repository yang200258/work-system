<template>
    <div class="restinput-container">
        <el-steps direction="vertical" :active="active">
            <el-step v-for="(item,i) in stepOptions" :key="item.title" :title="item.title" :class="'step' + i"></el-step>
        </el-steps>
        <div class="restinput-content">
            <div class="restinput-first">
                <el-select v-model="inputType" placeholder="请选择" size="mini" @change="changeInputType">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span>导入后的额度会覆盖系统中员工的额度</span>
            </div>
            <div class="restinput-second">
                <el-checkbox-group v-model="restType" @change="changeRestType">
                    <el-checkbox v-for="item in restTypeOption" :key="item.label" :label="item.label">{{item.name}}</el-checkbox>
                </el-checkbox-group>
                <div class="download">
                    <span>下载员工假期额度模版</span>
                    <el-button size="mini" type="primary">下载模板</el-button>
                </div>
            </div>
            <div class="restinput-third">
                <div class="restinput-line">
                    <div class="line"></div>
                    <div class="line"></div>
                </div>
                <span>注意事项：Excel模版中已有的内容都<span>不可修改</span>（包括改变顺序或者编辑删除等），否则无法成功导入。</span> 
            </div>
            <div class="restinput-fourth">
                <el-button size="mini" type="primary">选择模板</el-button>
            </div>
            <div class="restinput-five">
                <el-upload class="upload-demo" action="/upload" :limit="1" :file-list="fileList">
                    <el-button size="mini" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">注意事项：请核对上传的额度信息，上传后<span style="color:#FF0000;">不可撤销。</span></div>
                </el-upload>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            active:0,
            stepOptions: [{title:'选择导入的操作'},{title:'选择需要导入的假期'},{title:'填写Excel模版中的假期额度'},{title:'选择填写后的Excel文件'},{title:'上传修改的员工假期额度'},],
            options:[{label:'覆盖所有额度',value:0},{value:1,label:'调整额度'}],
            inputType:0,
            restTypeOption:[{label:0,name:'年假'},{label:1,name:'免责事假'},{label:2,name:'探父母假'}],
            restType:[],
            fileList: [],
        }
    },
    methods: {
        changeInputType:function() {
            if(this.active < 1)  this.active++
        },
        changeRestType:function() {
            if(this.active < 2)  this.active = 4
        },
    }
}
</script>
<style lang="scss" scoped>
.restinput-container {
    padding: 24px 50px 0 50px;
    display: grid;
    grid-template-columns: 300px auto;
    .el-steps {
        height: 700px;
        /deep/ .step0 {
            flex-basis: 10%!important;
        }
        /deep/ .step1 {
            flex-basis: 20%!important;
        }
        /deep/ .step3 {
            flex-basis: 10%!important;
        }
        /deep/ .el-step__title {
            font-size: 14px;
        }
    }
    .restinput-content {
        font-size: 12px;
        color: #606266;
        &>div {
            height: 168px;
        }
        .restinput-first{
            height: 70px;
            .el-select {
                margin-right: 16px;
            }
            span {
                font-size: 12px;
                color: #606266;
            }
        }
        .restinput-second {
            height: 144px;
            .download {
                margin-top: 20px;
                span {
                    display: inline-block;
                    margin-right: 40px;
                }
            }
        }
        .restinput-third {
            // height: 168px;
            .restinput-line {
                height: 110px;
                width: 400px;
                border: 1px solid #000;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                margin-bottom: 10px;
                .line {
                    height: 1px;
                    background-color: #000;
                    &:first-child {
                        width: 376px;
                        transform-origin: 0 0;
                        transform: rotate(15deg) scaleX(1.1)
                    }
                    &:last-child {
                        width: 376px;
                        transform-origin: 0 0;
                        transform: rotate(-15deg) scaleX(1.1)
                    }
                }
            }
            span {
                span {
                    color: #FF0000;
                }
            }
            
        }
        .restinput-fourth {
            height: 70px;
        }
        .restinput-five {
            .el-upload__tip {
                margin-top: 6px;
            }
        }
    }
}
</style>

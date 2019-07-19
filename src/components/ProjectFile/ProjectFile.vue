<template>
    <div class="project-file">
        <div class="project-form-item">
            <div class="file-type">请上传项目文件<em style="color: #b82415;font-size: 12px">(一次性可以选择多个)</em></div>
            <div class="file-data">
                <input type="file" ref="project" @change="getFileList(this,0)"/>
                <el-button type="primary" @click="uploadProject()">上传项目文件</el-button>
            </div>
        </div>

        <div class="project-form-item">
            <div class="file-type">请上传研发费用明细</div>
            <div class="file-data">
                <input type="file" ref="cost" @change="getFileList(this,0)"/>
                <el-button type="primary" @click="uploadCost()">上传研发费用明细</el-button>
            </div>
        </div>

        <!--<div class="project-form-item">-->
        <!--<div class="file-type">请上传项目文件<em style="color: #b82415;font-size: 12px">(一次性可以选择多个)</em></div>-->
        <!--<div class="file-data">-->
        <!--<input type="file" ref="project" @change="getFileList(this,0)" />-->
        <!--<el-button type="primary">上传项目文件</el-button>-->
        <!--</div>-->
        <!--</div>-->
    </div>
</template>

<script>
    export default {
        name: "ProjectFile",
        data() {
            return {}
        },
        methods: {
            getFileList: function (input, type) {
                var file = input.files;
                if (file.length < 1) {
                    this.$message({
                        message: '您还一个文件都没有选择',
                        type: 'warning'
                    });
                    return false
                }
                var params = new FormData();
                for (let i = 0; i < file.length; i++) {
                    params.append('file', file[i])
                }
                input.value='';
                return params
            },
            uploadProject: function () { //上传项目列表
                var input = this.$refs.project;
                var params=this.getFileList(input);
                if(params===false){
                    return false
                }
                let url = 'http://127.0.0.1/file/files';
                this.$http({"url": url, "method": "post", data: params}).then((res) => {
                    console.log(res);
                    let data = res.data;
                    if(data){
                        this.$message({
                            message: '上传项目文件成功,下面请上传研发费用明细',
                            type: 'success'
                        });
                    }
                })
            },
            uploadCost:function () {    //上传费用明细
                var input=this.$refs.cost;
                var params=this.getFileList(input);
                if(params===false){
                    return false
                }
                let url='http://127.0.0.1/file/incomdetails';

                this.$http({"url": url, "method": "post", data: params}).then((res) => {
                    console.log(res);
                    let data = res.data;
                    if(data){
                        this.$message({
                            message: '上传项目文件成功,下面请上传研发费用明细',
                            type: 'success'
                        });
                    }
                })

            }
        }
    }
</script>

<style scoped>

    .project-file {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .project-form-item {
        margin: 20px 20px;
        padding: 10px;
        border: 1px solid #e5e5e5;
        border-radius: 3px;
        display: flex;
        flex-direction: column;
    }

    .file-type {
        line-height: 36px;
        font-size: 14px;
    }

    .file-data {
        display: flex;
        justify-content: start;
    }

</style>

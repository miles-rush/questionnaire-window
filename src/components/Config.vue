<template>
    <el-container>
        <div id="form-outer">
            <el-card shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>参数面板</span>
                        <!-- <el-button class="button" type="text" @click="dialogVisible = true">使用说明</el-button> -->
                    </div>
                </template>
                <!-- <el-text>录制视频的保存路径:</el-text> -->
                <el-divider>录制视频的保存路径</el-divider>
                <div class="atom">
                    <el-row>
                        <el-col :span="18">
                            <el-input v-model="saveFilePath"></el-input>
                        </el-col>
                        <el-col :span="5" :offset="1">
                            <el-button type="primary" @click="chooseSaveFilePath()">选择</el-button>
                        </el-col>
                    </el-row>
                </div>
                <!-- <el-button>保存</el-button> -->
                <!-- <el-text style="margin-top: 15px;">切割视频的保存路径:</el-text> -->
                <el-divider>切割视频的保存路径</el-divider>
                <div class="atom">
                    <el-row>
                        <el-col :span="18">
                            <el-input v-model="spliteFilePath"></el-input>
                        </el-col>
                        <el-col :span="5" :offset="1">
                            <el-button type="primary" @click="chooseSpliteFilePath()">选择</el-button>
                        </el-col>
                    </el-row>
                </div>
                <el-divider>ffmpeg二进制文件路径</el-divider>
                <div class="atom">
                    <el-row>
                        <el-col :span="18">
                            <el-input v-model="ffmepgPath"></el-input>
                        </el-col>
                        <el-col :span="5" :offset="1">
                            <el-button type="primary" @click="chooseFfmpegFilePath()">选择</el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
        </div>
    </el-container>
</template>

<script>
const { dialog } = require('electron').remote
// const Store = require('electron-store')
const Store = require('electron-store')
const store = new Store()
export default {
    data() {
        return {
            saveFilePath: '',
            spliteFilePath: '',
            ffmepgPath: '',
        }
    },
    created() {
        // this.store = new Store()
        this.read()
    },
    methods: {
        // 选择保存视频的文件夹
        chooseSaveFilePath() {
            dialog.showOpenDialog({
                properties: [
                    'openDirectory'
                ]
            }).then(result => {
                console.log(result)
                if (result) {
                    this.saveFilePath = result.filePaths[0]
                    // 保存配置信息到本地
                    if (this.saveFilePath) {
                        store.set('saveFilePath', this.saveFilePath)
                        this.$message.success('保存配置成功');
                    }
                }
            })

        },
        chooseSpliteFilePath() {
            dialog.showOpenDialog({
                properties: [
                    'openDirectory'
                ]
            }).then(result => {
                console.log(result)
                if (result) {
                    this.spliteFilePath = result.filePaths[0]
                    // 保存配置信息到本地
                    if (this.saveFilePath) {
                        store.set('spliteFilePath', this.spliteFilePath)
                        this.$message.success('保存配置成功');
                    }
                }
            })
        },
        chooseFfmpegFilePath() {
            dialog.showOpenDialog({
                properties: [
                    'openFile'
                ]
            }).then(result => {
                console.log(result)
                if (result) {
                    this.ffmepgPath = result.filePaths[0]
                    // 保存配置信息到本地
                    if (this.ffmepgPath) {
                        store.set('ffmepgPath', this.ffmepgPath)
                        this.$message.success('保存配置成功');
                    }
                }
            })
        },
        read() {
            this.saveFilePath = store.get('saveFilePath')
            this.spliteFilePath = store.get('spliteFilePath')
            this.ffmepgPath = store.get('ffmepgPath')
            this.$message.success('读取本地配置成功');
        }
    }
}
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Raleway:400,500);

html,
body {
    background-color: #a9d7d1;
    /* text-align: center; */
    font-family: "Raleway", Helvetica, sans-serif;
    min-width: 320px;
}

#form-outer {
    /* background-color: rgb(250, 250, 250); */
    margin: 0 auto;
    border-radius: 4px;
    width: 75%;
    max-width: 900px;
    padding: 10px;
    padding-top: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text {
    font-size: 14px;
}

.atom {
    margin-top: 10px;
}

.left {
    margin-left: 10px;
}
</style>
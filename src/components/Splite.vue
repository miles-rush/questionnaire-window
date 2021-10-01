<template>
    <el-container>
        <div id="form-outer">
            <el-card shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>视频分割</span>
                        <!-- <el-button class="button" type="text" @click="dialogVisible = true">使用说明</el-button> -->
                    </div>
                </template>
            </el-card>
        </div>
    </el-container>
</template>

<script>
const path = require('path')
const fs = require('fs')
const Store = require('electron-store')
const store = new Store()
export default {
    data() {
        return {
            saveFilePath: '',
            spliteFilePath: '',
        }
    },
    created() {
        this.init()
    },
    methods: {

        init() {
            this.read()
            this.readFile(this.saveFilePath)
        },
        // 读取文件
        readFile(pathName) {
            let that = this
            fs.readdir(pathName, function (err, files) {
                var dirs = [];
                if(files.length == 0) {
                    that.$message.info('无数据')
                    return
                }
                (function iterator(i) {
                    if (i == files.length) {
                        console.log(dirs);
                        return;
                    }
                    fs.stat(path.join(pathName, files[i]), function (err, data) {
                        if (data.isFile()) {
                            dirs.push(files[i]);
                        }
                        iterator(i + 1);
                    });
                })(0);
            });


        },
        // 读取配置
        read() {
            this.saveFilePath = store.get('saveFilePath')
            this.spliteFilePath = store.get('spliteFilePath')
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
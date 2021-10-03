<template>
    <el-container>
        <div id="form-outer">
            <el-card shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>视频剪辑</span>
                        <el-button class="button" type="text" @click="keyAllDone()">一键剪辑</el-button>
                    </div>
                </template>

                <el-table :data="tableList" style="width: 100%">
                    <el-table-column prop="name" label="文件名" />
                    <el-table-column prop="date" label="创建时间" />
                    <el-table-column prop="haveData" label="答题数据">
                        <template #default="scope">
                            <el-tag type="success" v-if="scope.row.haveData == 1">已加载</el-tag>
                            <el-tag type="warning" v-if="scope.row.haveData == 0">缺失</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template #default="scope">
                            <el-tag v-if="scope.row.status == 1">已剪辑</el-tag>
                            <el-tag type="info" v-if="scope.row.status == 0">未剪辑</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button
                                @click="splite(scope.row.name)"
                                v-if="scope.row.status == 0"
                                type="success"
                                plain
                                size="small"
                                v-loading.fullscreen.lock="fullscreenLoading"
                                element-loading-text="剪辑中..."
                            >剪辑</el-button>
                            <el-button
                                @click="show(scope.row.action)"
                                v-if="scope.row.status == 1"
                                type="warning"
                                plain
                                size="small"
                            >查看</el-button>
                            <!-- <el-tag v-if="scope.row.status == 1">已剪辑</el-tag>
                            <el-tag type="info" v-if="scope.row.status == 0">未剪辑</el-tag>-->
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top:20px">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[1, 5, 10, 20]"
                    :page-size="size"
                    layout="total, sizes, prev, pager, next"
                    :total="total"
                ></el-pagination>
                </div>
                
            </el-card>
        </div>
    </el-container>
</template>

<script>
const path = require('path')
const fs = require('fs')
const Store = require('electron-store')
const store = new Store()
import axios from 'axios'
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

const ffmpeg = require('fluent-ffmpeg')
export default {

    data() {
        return {
            saveFilePath: '',
            spliteFilePath: '',
            wholeData: null,
            // 总文件目录
            files: null,
            // 用于分页的文件目录
            partFiles: [],
            tableList: [],
            fullscreenLoading: false,
            actionForm: {
                answers: null,
                input: null,
                preOutput: null,
            },
            total: 0,
            currentPage: 1,
            size: 5,
        }
    },
    created() {
        this.init()
    },
    methods: {
        // 分页相关
        handleSizeChange(val) {
            this.size = val
            this.renew()
        },
        handleCurrentChange(val) {
            this.currentPage = val 
            this.renew()
        },

        async init() {
            this.read()
        },
        // 读取文件
        async readFile(pathName) {
            let that = this
            fs.readdir(pathName, function (err, files) {
                var dirs = [];
                if (files.length == 0) {
                    that.$message.info('无数据')
                    return
                }
                (function iterator(i) {
                    if (i == files.length) {
                        that.files = dirs
                        that.total = dirs.length
                        that.loadData()
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
        // 从服务器下载数据
        async loadData() {
            const result = await axios.get(this.$url + '/base/list')
            if (result.data.code == 200) {
                this.wholeData = result.data.data
                console.log(this.wholeData);
                this.makeTable()
            } else {
                this.$message.error('数据下载失败');
            }

        },
        // 表格数据初始化
        makeTable() {
            // files -> part files
            let size = this.size // 每页的大小
            let currentPage = this.currentPage //当前页
            let s = size * (currentPage -1)
            let e = currentPage * size - 1
            // 清空partFiles
            if(this.partFiles.length > 0) {
                this.partFiles.splice(0, this.partFiles.length)
            }
            if(this.tableList.length > 0) {
                this.tableList.splice(0, this.tableList.length)
            }
            
            for(let i = s; i <= e; i++) {
                if(i > this.files.length - 1) {
                    continue
                }
                this.partFiles.push(this.files[i])
                
            }

            for (let i = 0; i < this.partFiles.length; i++) {
                let videoName = this.partFiles[i]
                console.log('videoName', videoName)
                // 取到无格式后缀的文件名
                let input = this.saveFilePath + '\\' + videoName
                let videoNameWithoutWebm = videoName.split('.')[0]
                // let suffix = videoName.split('.')[1]

                let item = new Object()
                item.name = videoName
                item.action = videoNameWithoutWebm

                // 寻找数组中有无匹配的项
                item.haveData = 0
                for (let j = 0; j < this.wholeData.length; j++) {
                    let data = this.wholeData[j]
                    console.log('item data', data)
                    // 存在错误数据的问题 特别处理
                    if (data.content == null) {
                        continue
                    }
                    if (data.content.videoName == videoNameWithoutWebm) {
                        item.haveData = 1
                        break
                    }
                }
                // 判断是否已经剪辑过 查询本地是否有路径
                let outFilePath = this.spliteFilePath + '/' + videoNameWithoutWebm + '/'
                if (this.fsExists(outFilePath)) {
                    item.status = 1
                } else {
                    item.status = 0
                }

                // 获取文件的创建时间
                let date = this.readDate(input)
                item.date = date

                this.tableList.push(item)

            }
            console.log('table data', this.tableList)
        },

        readDate(path) {
            let stat = fs.statSync(path)
            // console.log('date', stat)
            let time = stat.birthtime
            let formatTime = new Date(time).format("yyyy-MM-dd hh:mm:ss")
            return formatTime
        },

        // 剪辑
        async splite(fileNameWhole) {
            let that = this
            let fileName = fileNameWhole.split('.')[0]
            let suffix = fileNameWhole.split('.')[1]

            // const ffmpeg = require('fluent-ffmpeg')
            // let sleep = require('sleep');
            // const ffmpegPath = require('@ffmpeg-installer/ffmpeg')
            // const ffprobePath = require('@ffprobe-installer/ffprobe')

            //let os = require('os')
            let ffmpegPath = store.get('ffmepgPath')

            ffmpeg.setFfmpegPath(ffmpegPath);

            // if(os.platform() === 'win32') {
            //     let ffmpegPath = ''
            // }else{
            //     let ffmpegPath = ''
            // }

            this.fullscreenLoading = true
            // 传入的filename不要后缀
            let input = this.saveFilePath + '\\' + fileName + '.' + suffix
            // 输出的文件夹前缀
            let preOutput = this.spliteFilePath + '\\' + fileName
            // proc.setFfmpegPath(ffmpegPath)

            let targetData = null
            // 找到对应的数据
            for (let i = 0; i < this.wholeData.length; i++) {
                let data = this.wholeData[i]
                if (data.content == null) {
                    continue
                }
                if (data.content.videoName == fileName) {
                    targetData = data
                    break
                }
            }
            console.log(targetData)

            // 处理targetData
            if (targetData != null) {
                // 先创建上层目录
                // let topFilePath = preOutput + '\\'
                // this.makeDir(topFilePath)
                let answers = targetData.answers
                // let type = ''
                // 做一层预备赋值
                this.actionForm.answers = answers
                this.actionForm.preOutput = preOutput
                this.actionForm.input = input

                console.log(this.actionForm)
                // let actions = []
                // for (let i = 0; i < answers.length; i++) {
                //     let action = () => {
                //         return new Promise(resolve => {
                //             that.action(i)
                //             resolve()
                //         })
                //     }
                //     actions.push(action)
                // }
                // let i = answers.length

                // way1
                this.createSplite(0)
                // way2
                // Promise.all(actions).then(() => {
                //     that.fullscreenLoading = false
                // })


                // this.fullscreenLoading = false

            } else {
                this.fullscreenLoading = false
                this.$message.info('无对应数据，剪辑失败')
            }
        },
        action(i) {
            let input = that.actionForm.input
            let preOutput = that.actionForm.preOutput
            let answer = that.actionForm.answers[i]
            console.log(answer)

            let newFilePath = preOutput + '\\' + answer.type + '\\'
            if (!that.fsExists(newFilePath)) {
                this.makeDir(newFilePath)
            }

            let fianlPath = preOutput + '\\' + answer.type + '\\' + answer.id + '.mp4'
            let startTime = answer.stime
            let passTime = answer.pass

            let proc = new ffmpeg({
                source: input,
                nolog: true,
                // timeout: 1000
            })
            proc.inputOptions(
                '-ss', startTime,
                '-t', passTime,
            ).on('start', function (e) {
                console.log('---开始剪辑---')
                console.log(e);
            }).on('error', function (err) {
                console.log('---剪辑失败---', err)
            }).on('end', function () {
                console.log('---剪辑成功---')
            }).saveToFile(fianlPath)
        },
        // 递归切割
        createSplite(i) {
            let that = this
            if (i == this.actionForm.answers.length) {
                //this.fullscreenLoading = false
                return
            } else {
                // that.createSplite(i + 1)
                // delay(2000)
                let input = that.actionForm.input
                let preOutput = that.actionForm.preOutput
                let answer = that.actionForm.answers[i]
                console.log(answer)

                let newFilePath = preOutput + '\\' + answer.type + '\\'
                if (!that.fsExists(newFilePath)) {
                    this.makeDir(newFilePath)
                }

                let fianlPath = preOutput + '\\' + answer.type + '\\' + answer.id + '.mp4'
                let startTime = answer.stime
                let passTime = answer.pass

                let proc = new ffmpeg({
                    source: input,
                    nolog: true,
                    // timeout: 1000
                })
                proc.inputOptions(
                    '-ss', startTime,
                    '-t', passTime,
                ).on('start', function (e) {
                    console.log('---开始剪辑---')
                    console.log(e);
                }).on('error', function (err) {
                    console.log('---剪辑失败---', err)
                }).on('end', function () {
                    that.createSplite(i + 1)
                    console.log('---剪辑成功---', i)
                    // 执行完毕
                    if (i == that.actionForm.answers.length - 1) {
                        that.fullscreenLoading = false

                        that.$message.success('剪辑已完成')
                        that.renew()
                    }
                    // console.log('length', that.actionForm.answers.length)
                }).saveToFile(fianlPath)

                //delay(3000)
                //that.createSplite(i + 1)
                // console.log('第几轮', i)

            }
        },
        // 一键剪辑
        keyAllDone() {
            this.$message.error('一键剪辑存在内存爆炸问题，等待修复')
            return
            for(let i = 0; i < this.partFiles.length; i++) {
                this.split(partFiles[i])
            }
        },
        // 刷新表格数据
        renew() {
            this.tableList.splice(0, this.tableList.length)
            this.makeTable()
        },
        makeDir(filePath) {
            fs.mkdir(filePath, { recursive: true }, function (error) {
                if (error) {
                    console.log('创建文件夹出错', error)
                } else {
                    console.log('创建文件夹成功')
                }

            })
        },
        // 查看
        show(fileName) {
            const { shell } = require("electron").remote;
            let target = this.spliteFilePath + '\\' + fileName + '\\'
            console.log(target)
            shell.showItemInFolder(target)
        },
        // 读取配置
        read() {
            this.saveFilePath = store.get('saveFilePath')
            this.spliteFilePath = store.get('spliteFilePath')
            this.$message.success('读取本地配置成功');
            this.readFile(this.saveFilePath)
        },
        fsExists(path) {
            try {
                fs.accessSync(path, fs.F_OK)
            } catch (e) {
                return false
            }
            return true
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
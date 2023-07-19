window.onload = () => {
    var app = new Vue({
        el: "#player",
        data: {
            query: '',  // 搜索关键字
            musicList: [],  // 音乐列表
            hotCommentsList: [],  // 评论列表
            musicUrl: '',  // 音乐地址
            picUrl: '',  // 图片地址
            currentSongIndex: -1,  // 当前歌曲的index
            isPlaying: false, // 歌曲播放状态
            mvUrl: '',  // mv地址
            isShow: false,  // mv界面的显示和隐藏
            songName: '',  // 歌名
            songAuthor: ''  // 歌手名
        },
        methods: {
            // 搜索歌曲
            searchMusic: function () {
                axios.get(
                    'https://autumnfish.cn/search?keywords=' + this.query
                )
                    .then(res => {
                        this.musicList = res.data.result.songs
                    })


            },

            // 播放音乐
            playMusic: function (musicId) {
                axios.get(
                    'https://autumnfish.cn/song/url?id=' + musicId,
                )
                    .then(res => {
                        this.musicUrl = res.data.data[0].url
                    })

                axios.get(
                    'https://autumnfish.cn/song/detail?ids=' + musicId,
                )
                    .then(res => {
                        this.picUrl = res.data.songs[0].al.picUrl
                    })


                axios.get(
                    'https://autumnfish.cn/comment/hot?type=0&id=' + musicId,
                )
                    .then(res => {
                        this.hotCommentsList = res.data.hotComments
                    })


            },
            // 获取当前歌曲的index
            getIndex: function (e) {
                this.currentSongIndex = e.target.getAttribute('index')
                this.songAuthor = this.musicList[this.currentSongIndex].artists[0].name
                this.songName = this.musicList[this.currentSongIndex].name
            },

            // 切换歌曲状态：播放
            play: function () {
                this.isPlaying = true
            },

            // 切换歌曲状态：暂停
            pause: function () {
                this.isPlaying = false
            },
            overAudio: function () {

            },
            // 播放mv
            playMv: function (mvId) {
                axios.get('https://autumnfish.cn/mv/url?id=' + mvId)
                    .then(res => {
                        this.isShow = true
                        this.mvUrl = res.data.data.url
                        this.$refs.audio.pause()
                    })
            },
            // 隐藏mv
            hide: function () {
                this.isShow = false
                this.$refs.video.pause()
            },
            // 当前播放结束后，自动播放下一曲
            autoNext: function () {
                this.currentSongIndex++
                let nextMusic = this.musicList[parseInt(this.currentSongIndex)]
                this.playMusic(nextMusic.id)
                // 如果歌曲放到底就从头开始
                if (this.currentSongIndex == this.musicList.length - 1) {
                    this.currentSongIndex = -1
                }
                this.songAuthor = this.musicList[this.currentSongIndex].artists[0].name
                this.songName = this.musicList[this.currentSongIndex].name
            }
        },
        created: function () {
            axios.get(
                'https://autumnfish.cn/search?keywords=李荣浩'
            )
                .then(res => {
                    this.musicList = res.data.result.songs
                })
        }
    })
}
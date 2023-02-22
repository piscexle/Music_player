const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const song = $('.song')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Rồi ta sẽ ngắm pháo hoa cùng nhau',
            singer: 'O.lew',
            path: './assets/music/RoiTaSeNgamPhaoHoaCungNhau-OlewVietNam.mp3',
            image: './assets/img/RoiTaSeNgamPhaoHoaCungNhau.jpg'
        },
        {
            name: 'Ngủ một mình (tình rất tình)',
            singer: 'HIEUTHUHAI, Negav, Kewtiie',
            path: './assets/music/NguMotMinhTinhRatTinh.mp3',
            image: './assets/img/NguMotMinhTinhRatTinh.jpg'
        },
        {
            name: '3107 3 (Lofi Version)',
            singer: 'Nâu, W/n, DuongG, V.A',
            path: './assets/music/31073LofiVersion.mp3',
            image: './assets/img/31073.jpg'
        },
        {
            name: 'Anh Sẽ Về Sớm Thôi',
            singer: 'Issac',
            path: './assets/music/AnhSeVeSomThoi.mp3',
            image: './assets/img/AnhSeVeSomThoi.jpg'
        },
        {
            name: 'Anh Yêu Em Cực',
            singer: 'Linh Thộn, Minh Vũ',
            path: './assets/music/AnhYeuEmCuc.mp3',
            image: './assets/img/AnhYeuEmCuc.jpg'
        },
        {
            name: 'Waiting For You',
            singer: 'MONO, Onionn',
            path: './assets/music/WaitingForYou.mp3',
            image: './assets/img/WaitingForYou.jpg'
        }
    ],

    render: function() {
        const htmls = this.songs.map((song) => {
            return `
                <div class="song">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('\n')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    hanlderEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý cd quay / dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg'}
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity //loop vo han
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to /  thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY | document.documentElement.scrollTop
            const newScrollTop = cdWidth - scrollTop

            cd.style.width = newScrollTop > 0 ? newScrollTop + 'px' : 0
            cd.style.opacity = newScrollTop / cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            //Khi song được play
            audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }

            // Khi song bị pause
            audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }

            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }

            //Khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }
            }
        }

        // Xử lý khi tua song
        progress.oninput = function(e) {
            const seekTime =  e.target.value / 100 * audio.duration
            audio.currentTime = seekTime
        }

        // Khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else { 
                _this.nextSong()
            }
            audio.play()
        }

        // Khi prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else { 
                _this.prevSong()
            }
            audio.play()
        }

        // Xử lý bat / tat random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            _this.playRandomSong()
        }

        // Xử lý next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                _this.playRepeatSong()
            } else {
                nextBtn.click()
            }
            audio.play()
        }

        // Xử lý bat / tat repeat song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    }, 

    //khi prev song
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    playRepeatSong: function() {
        this.currentIndex = this.currentIndex
        this.loadCurrentSong()
    },


    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        //Lắng nghe /  xử lý các sự kiện  (DOM events)
        this.hanlderEvents()

        //Tải thông tin bài hát đầu tiên vào UI chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }
}

app.start()

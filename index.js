var $$ = document.querySelectorAll.bind(document);  
var $ = document.querySelector.bind(document);

const PLAYER_STORAGE_KEY = 'BO_T'
const progressMusic = $('.progress-music p');
const progressSong = $('.progress-song');
const platBtn = $('.btn-toggle-play');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const cdThumb = $('.cd-thumb');
const heading = $('header h2');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const player = $('.player');
const audio = $('#audio');
const cd = $('.cd');



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    array: [],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: 'À lôi',
            singer: 'Double2T',
            path: './music/ALoi-Double2TMasew-10119691.mp3',
            image: './imag/th\ \(1\).jpg'
        },
        {
            name: 'Đủ trải sẽ thấm',
            singer: 'Mikelodic x Chiennhatlang',
            path: './music/DuTraiSeTham-MIKEVietNamChiennhatlang-7828808.mp3',
            image: './imag/th\ \(2\).jpg'
        },
        {
            name: 'Mùa hè tuyệt vời',
            singer: 'Đức Phúc',
            path: './music/MuaHeTuyetVoiLalawonder-DucPhuc-9835888.mp3',
            image: './imag/Screenshot-2023-06-22-103850.png'
        },
        {
            name: 'Hạ Đầu Tam Bái',
            singer: 'Hoon x Anh Rồng',
            path: './music/cic0jqwf5o.mp3',
            image: './imag/th.jpg'
        },
        {
            name: 'Giũa đại lộ đông tây',
            singer: 'Uyên Linh',
            path: './music/GiuaDaiLoDongTaySoloVersion-UyenLinh-6999584.mp3',
            image: './imag/gdldt.jpg'
        },
        {
            name: 'Đường Tôi Chở Em Về',
            singer: 'buitruonglinh',
            path: './music/DuongTaChoEmVe-buitruonglinh-6318765.mp3',
            image: './imag/maxresdefault.jpg'
        },
        {
            name: 'Cưới Thôi',
            singer: 'Masiu, Masew',
            path: './music/CuoiThoi-MasewMasiuBRayTAPVietNam-7085648.mp3',
            image: './imag/maxresdefault1.jpg'
        },
        {
            name: 'Ừ Có Anh Đây',
            singer: 'Tino',
            path: './music/UCoAnhDay-Tino-5277338.mp3',
            image: './imag/maxresdefault2.jpg'
        }
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function () {
        
        var htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}"  data-index = "${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
          </div>
        `
        }).join('');
        playlist.innerHTML = htmls;
        
        // chọn bài hát
        // const song = $$('.song');
        // song.forEach((e, i) => {
        //     e.onclick = function () {
        //         if (app.currentIndex === i) {
                    
        //         } else {
        //             app.currentIndex = i;
        //             app.loadCurrentSong();
        //             app.render();
        //             audio.play(); 
        //         }
                
        //     }
        // });

    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function () {
       
        const _this = this;
        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        

        //Xử lý phóng to / thu nhỏ cd
        const cdWidth = cd.offsetWidth;
        window.onscroll = function () {
            const widthscroll = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - widthscroll;

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;

            cd.style.opacity = newWidth / cdWidth;
        }


        //Xử lý khi click play
        platBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // khi song được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // khi song được pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            const currentSong = audio.duration;
            const timeMusic = ((currentSong / 60) - Math.floor(currentSong / 60)) * 0.6 + Math.floor(currentSong / 60);
            if (audio.duration) {
                progressMusic.textContent = `${timeMusic.toFixed(2)}`;
                const progressPercent = Math.floor(audio.currentTime / currentSong * 100);      
                progressSong.value = progressPercent;
            } else {
                progressMusic.textContent = `${'0.00'}`
            }
        }

        // Khi tua bài hát thay đổi
        progressSong.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Next nhạc
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiceSong();

        }

        // prev nhạc
        prevBtn.onclick = function () {
            if (_this.isRandom ) {
                _this.playRandomSong();
            } else {
                _this.prevSong();

            }
            audio.play();
            _this.render();
            _this.scrollToActiceSong();
        }

        // Xử lý bật / tắt random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Khi nhấn repeat thì nghe lại nhạc
        repeatBtn.onclick = function () {
            // audio.currentTime = 0;
            // audio.play();

            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Khi nhạc end
        audio.onended = function () {
            if (_this.isRepeat) {
                _this.playRepeactSong();
            } else {
                _this.nextSong();
                _this.render();
                audio.play();
            }
            
        }

        // Chọn nhạc
        playlist.onclick = function (a) {
            const songActive = a.target.closest('.song');
            const songNode = a.target.closest('.song:not(.active)');
            const optionSong = a.target.closest('.option');
            if( songNode || optionSong) {
                if ( songNode && !optionSong ) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play(); 
                } else {
                    
                }
            }
        }


    },

    scrollToActiceSong: function () {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        })
    },

    loadCurrentSong: function () {
        heading.textContent = `${this.currentSong.name}`;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRandom;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        let arrayRepeact =  this.array.some ((course)=> {
            return course === newIndex;
        });
        console.log(arrayRepeact);
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex == this.currentIndex && newIndex === this.array);
        this.array.push(newIndex);
        if (this.array.length === this.songs.length) {
            this.array.length = 0;
        }
        this.currentIndex = newIndex;
        this.loadCurrentSong()
    },

    playRepeactSong: function () {
        audio.currentTime = 0;
        audio.play();
    },

    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thôg tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // hiển thị playlist
        this.render();


        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.isRandom);
    }
}


app.start();

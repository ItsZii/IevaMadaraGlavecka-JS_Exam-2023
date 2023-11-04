<script>
import { mapState, mapActions } from 'pinia';
import { usePlayerStore } from '@/stores/player';
import IconPlay from './icons/IconPlay.vue';
import IconPause from './icons/IconPause.vue';
import IconNext from './icons/IconNext.vue';
import IconPrev from './icons/IconPrevious.vue';

export default {
    props: ["song_preview_url"],
    components: { IconPlay, IconPause, IconNext, IconPrev },
    data() {
        return {
            time          : undefined,
            btn_prev      : undefined,
            btn_next      : undefined,
            is_playing    : false,
            audio_playback: undefined,
            audio_time    : 0,
            audio_volume  : 1,
            audio_length  : 0
        };
    },
    unmounted() {
        clearInterval(this.audio_playback);
    },
    methods: {
        ...mapActions(usePlayerStore, {
            setNowPlaying  : "setNowPlaying",
            resetNowPlaying: "resetNowPlaying",
        }),
        playSong(preview) {
            this.is_playing      = true;
            this.$refs.audio.src = preview;

            this.$refs.audio.play();

            // Start interval
            this.audio_playback = setInterval(() => {
                this.audio_time   = Math.round(this.$refs.audio.currentTime);
                this.audio_length = Math.round(this.$refs.audio.duration);

                this.$refs.time.style.width = (this.audio_time * 100) / this.audio_length + '%';

                if (this.audio_time === this.audio_length) {
                    if (this.next_song) {
                        return this.setNowPlaying(this.next_song);
                    }

                    this.togglePlay();

                    this.is_playing = false;
                    this.$refs.time.style.width = 0;

                    return this.resetNowPlaying();
                }
            }, 10)
        },
        togglePlay() {
            clearInterval(this.audio_playback);

            this.is_playing = !this.is_playing;

            if (this.is_playing) this.$refs.audio.play();
            else this.$refs.audio.pause();
        },
        updateVolume() {
            this.$refs.audio.volume = this.audio_volume;
        },
    },
    computed: {
        ...mapState(usePlayerStore, {
            now_playing           : "getNowPlaying",
            now_playing_song_id   : "getNowPlayingSongId",
            song_preview          : "getNowPlayingSongPreview",
            now_playing_song_image: "getNowPlayingSongImage",
            now_playing_song_name : "getNowPlayingSongName",
            now_playing_artists   : "getNowPlayingArtists",
            next_song             : "getNextSong",
            previous_song         : "getPreviousSong",
        }),
        get_playback_time() {
            return `0:${this.audio_time.toString().length === 1 ? `0${this.audio_time}` : this.audio_time}`
        },
        get_audio_length() {
            return `0:${this.audio_length.toString().length === 1 ? `0${this.audio_length}` : this.audio_length}`
        }
    },
    watch: {
        song_preview(newValue) {
            this.playSong(newValue);
        }
    }
}
</script>

<template>
    <div id="audio-player">
        <audio ref="audio" preload>
            <source :src="song_preview" type="audio/mpeg" />
        </audio>
        <div id="controls">
            <div class="wrapper-song-info">
                <img :src="now_playing_song_image" alt="" />
                <div class="song-info">
                    <p class="song-title">{{ now_playing_song_name }}</p>
                    <p class="song-artists">{{ now_playing_artists }}</p>
                </div>
            </div>
            <div class="wrapper-playback-controls">
                <div class="playback-controls">

                    <!-- PREVIOUS SONG BUTTON -->
                    <button
                        ref="prev"
                        class="prev"
                        @click="setNowPlaying(previous_song)"
                        :disabled="!previous_song"
                    >
                        <IconPrev color="#FFF" width="60%"/>
                    </button>

                    <!-- PLAY/PAUSE BUTTON -->
                    <button
                        ref="play"
                        class="play"
                        @click="togglePlay()"
                        :disabled="!now_playing_song_id"
                    >
                        <IconPause v-if="is_playing" color="#FFF" width="60%" />
                        <IconPlay v-else color="#FFF" width="60%" />
                    </button>

                    <!-- NEXT SONG BUTTON -->
                    <button
                        ref="next"
                        class="next"
                        @click="setNowPlaying(next_song)"
                        :disabled="!next_song"
                    >
                        <IconNext color="#FFF" width="60%"/>
                    </button>
                </div>
                <div class="wrapper-audio-track">

                    <!-- PLAYBACK TIME -->
                    <p>{{ get_playback_time }}</p>

                    <!-- PROGRESS BAR -->
                    <div ref="audio-track" class="audio-track">
                        <div ref="time" class="time"></div>
                    </div>

                    <!-- PLAYBACK TOTAL TIME -->
                    <p>{{ get_audio_length }}</p>
                </div>
                
            </div>
            <div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    v-model="audio_volume"
                    @input="updateVolume"
                />
            </div>
        </div>
    </div>
</template>


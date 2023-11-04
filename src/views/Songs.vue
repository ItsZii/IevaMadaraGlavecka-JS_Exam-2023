<template>
    <div id="songs-view" @scroll="handleScroll">
        <div class="wrapper-header">
            <h1>SONGS</h1>
            <div class="wrapper-search">
                <input id="input-search" placeholder="Search by title..." v-model="search" />
            </div>
            <div class="wrapper-settings">
                <button id="btn-show-favorites" :class="{active: showFavorites}" @click="toggleShowFavorites">Show Favorites</button>
            </div>
        </div>
        <div class="wrapper-songs">
            <table cellspacing="0" cellpadding="0">
                <tr ref="header">
                    <th id="th-id" >#</th>
                    <th id="th-title" :class="{active: sortState.title !== 0}" @click="sortBy('title')">
                        Title
                        <IconCaretUp v-if="sortState.title !== 0" :class="{'flip-vertical': sortState.title === 2 }"/>
                    </th>
                    <th id="th-artist">Artist</th>
                    <th id="th-album">Album</th>
                    <th id="th-duration" :class="{ active: sortState.duration !== 0 }" @click="sortBy('duration')">
                        Duration
                        <IconCaretUp v-if="sortState.duration!==0" :class="{'flip-vertical': sortState.duration === 2}" />
                    </th>
                </tr>
                
                <tr class="song" v-for="(song, index) in filteredSongs" @dblclick="selectSong(song)" :class="{ 'active': store.getNowPlayingSongId === song.id}">
                    <td id="td-index">
                        <IconPlay v-show="store.getNowPlayingSongId === song.id"/>
                        <span id="txt-index" v-show="store.getNowPlayingSongId !== song.id">{{ index+1 }}</span>
                    </td>
                    <td id="td-title">
                        <img :src="song.album.images[0].url" />
                        {{song.name}}
                    </td>
                    <td id="td-artist">{{ getArtist(song.artists) }}</td>
                    <td id="td-album">{{song.album.name}}</td>
                    <td id="td-duration">
                        {{ getTime(song.duration_ms) }}
                        <IconHeart :class="{active: isFavorite(song.id)}" @click="storeAuth.toggleFavorite(song.id)" />
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
import { usePlayerStore } from '@/stores/player.js';
import { useAuthStore } from '@/stores/auth.js';
import Songs from '../data/songs.js';
import IconPlay from '@/components/icons/IconPlay.vue';
import IconHeart from '@/components/icons/IconHeart.vue';
import IconCaretUp from '@/components/icons/IconCaretUp.vue';

export default {
    data(){
        return{
            search: '',
            showFavorites: false,
            songs: Songs,
            store: usePlayerStore(),
            storeAuth: useAuthStore(),
            sortState: {
                title: 0,
                duration: 0
            },
        }
    },

    computed: {
        filteredSongs() {
            const { search, songs } = this;
            return songs.filter(song => song.name.toLowerCase().includes(search.toLowerCase()));
        }
    },

    methods:{
        getTime(time) {
            const minutes = Math.floor(time / 60000);
            const seconds = Math.floor((time % 60000) / 1000);
            const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
            return `${minutes}:${formattedSeconds}`;
        },

        selectSong(song) {
            this.store.setPlaylist(this.songs);
            this.store.setNowPlaying(song);
        },

        getArtist(artists) {
            const artistNames = artists.map(artist => artist.name);
            return artistNames.join(', ');
        },

        handleScroll(event) {
            const isScrolled = event.target.scrollTop > 100;
            this.$refs.header.classList.value = isScrolled ? 'scrolled' : '';
        },

        isFavorite(id) {
            return this.storeAuth.getFavoriteSongs.includes(id);
        },

        sortBy(field) {
            const sortedSongs = [...this.songs];
            const order = this.sortState[field] = (this.sortState[field] + 1) % 3;

            if (order === 0) {
                this.songs = [...originalSongs];
            } else {
                sortedSongs.sort((a, b) => {
                    if (field === 'title') return (order === 1 ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
                    else if (field === 'duration') return (order === 1 ? a.duration_ms - b.duration_ms : b.duration_ms - a.duration_ms);
                });
                this.songs = sortedSongs;
            }
        },

        toggleShowFavorites() {
            this.showFavorites = !this.showFavorites;
            if (this.showFavorites) {
                this.songs = this.songs.filter(song => this.storeAuth.getFavoriteSongs.includes(song.id));
            } else {
                this.songs = Songs;
            }
        },
    },

    components:{
        IconPlay,
        IconHeart,
        IconCaretUp
    }
}
</script>

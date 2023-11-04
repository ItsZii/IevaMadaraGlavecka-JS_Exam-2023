<template>
    <div id="album-view">
      <div class="wrapper-header">
        <h1>ALBUMS</h1>
        <div class="settings">
          <button
            id="btn-grid"
            :class="{ active: layout === 'grid' }"
            @click="setAlbumLayout('grid')"
          >
            <GridIcon />
          </button>
          <button
            id="btn-list"
            :class="{ active: layout === 'list' }"
            @click="setAlbumLayout('list')"
          >
            <ListIcon />
          </button>
        </div>
      </div>
      <ul id="list-albums" :class="{ grid: layout === 'grid' }">
        <li 
            class="album" 
            v-for="album in albums" 
            :key="album.id" 
            @dblclick="playAlbum(album)" 
            :class="{ active: player.getNowPlayingAlbumID === album.id }"
        >
          <img id="img-album" :src="album.image" />
          <div class="album-info">
            <h4 id="txt-album-name">{{ album.name }}</h4>
            <p id="txt-album-artists">{{ album.artist }}</p>
            <div class="album-year">
              <p id="txt-album-year">{{ getYear(album.release_date) }}</p>
              <p id="txt-album-tracks">{{ getTrackCount(album) }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { usePlayerStore } from '@/stores/player.js';
  import songs from '../data/songs.js';
  import GridIcon from '@/components/icons/IconGrid.vue';
  import ListIcon from '@/components/icons/IconList.vue';
  
  export default {
    data() {
      return {
        songs: songs,
        player: usePlayerStore(),
        layout: 'grid',
      };
    },
    computed: {
      albums() {
        const uniqueAlbums = {};
        this.songs.forEach(song => {
          if (!uniqueAlbums[song.album.id]) {
            uniqueAlbums[song.album.id] = {
              id: song.album.id,
              name: song.album.name,
              artist: song.artists[0].name,
              image: song.album.images[1].url,
              release_date: song.album.release_date,
              songs: [],
            };
          }
          uniqueAlbums[song.album.id].songs.push(song);
        });
        return Object.values(uniqueAlbums);
      },
    },
    methods: {
      setAlbumLayout(layout) {
        this.layout = layout;
      },
      playAlbum(album) {
        this.player.setPlaylist(album.songs);
        this.player.setNowPlaying(album.songs[0]);
      },
      getYear(date) {
        return date.split('-')[0];
      },
      getTrackCount(album) {
        const songCount = album.songs.length;
        const pluralizedSong = songCount > 1 ? 'songs' : 'song';
        return `${songCount} ${pluralizedSong}`;
        },
    },
    components: {
      ListIcon,
      GridIcon,
    },
  };
  </script>
  
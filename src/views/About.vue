<template>
    <div id="about-view">
      <div class="wrapper-header">
        <h1>ABOUT ME</h1>
        <div class="settings">
          <button id="btn-edit" @click="toggleEditForm" :class="{ active: isActive }">
            {{ isActive ? 'Cancel' : 'Edit Form' }}
          </button>
          <button id="btn-save" v-if="isActive" @click="saveForm">Save Form</button>
        </div>
      </div>
      <form>
        <div class="wrapper-input">
          <label>NAME</label>
          <input id="input-name" v-if="isActive" v-model="userData.name" />
          <p id="txt-name" v-else>{{ authStore.user.name }}</p>
        </div>
        <div class="wrapper-input">
          <label>SURNAME</label>
          <input id="input-surname" v-if="isActive" v-model="userData.surname" />
          <p id="txt-surname" v-else>{{ authStore.user.surname }}</p>
        </div>
        <div class="wrapper-input">
          <label>STUDENT CODE</label>
          <input id="input-code" v-if="isActive" v-model="userData.code" />
          <p id="txt-code" v-else>{{ authStore.user.code }}</p>
        </div>
        <div class="wrapper-songs">
          <label>FAVORITE SONGS</label>
          <ul v-show="authStore.getFavoriteSongs.length > 0">
            <li v-for="song in favoriteSongs" :key="song.id">
              <img id="img-album" :src="song.album.images[0].url" />
              <div class="song-info">
                <p id="txt-song" class="song-name">{{ song.name }}</p>
                <p id="txt-artist" class="song-artists">{{ getArtist(song.artists) }}</p>
              </div>
            </li>
          </ul>
          <div id="txt-empty" class="empty" v-show="authStore.getFavoriteSongs.length === 0">
            NO SONGS FOUND
          </div>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '@/stores/auth';
  import songs from '../data/songs.js';
  
  export default {
    data() {
      return {
        authStore: useAuthStore(),
        isActive: false,
        userData: {
          name: '',
          surname: '',
          code: '',
        },
      };
    },

    created() {
      this.userData.name = this.authStore.user.name;
      this.userData.surname = this.authStore.user.surname;
      this.userData.code = this.authStore.user.code;
    },

    computed: {
      favoriteSongs() {
        return songs.filter(song => this.authStore.getFavoriteSongs.includes(song.id));
      },
    },
    
    methods: {
      saveForm() {
        this.authStore.setUserData(this.userData.name, this.userData.surname, this.userData.code);
        this.isActive = false;
      },
      toggleEditForm() {
        if (this.isActive) {
          this.userData.name = this.authStore.user.name;
          this.userData.surname = this.authStore.user.surname;
          this.userData.code = this.authStore.user.code;
        }
        this.isActive = !this.isActive;
      },
      getArtist(artists) {
        return artists.map(artist => artist.name).join(', ');
      },
    },
  };
  </script>
  
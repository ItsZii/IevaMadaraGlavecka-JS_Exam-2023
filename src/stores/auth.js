import { defineStore } from 'pinia';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      name: "NAME",
      surname: "SURNAME",
      code: "CODE1234",
      favoriteSongs: JSON.parse(localStorage.favoriteSongs ?? '[]'),
    },
    authenticated: localStorage.getItem('is_authenticated') === 'true' || false,
  }),

  getters: {
    is_authenticated: (state) => state.authenticated,
    getFavoriteSongs: (state) => state.user.favoriteSongs,
  },

  actions: {
    setUserData(name, surname, code) {
      this.user.name = name;
      this.user.surname = surname;
      this.user.code = code;
    },

    authenticate(email, password) {
      if (email === "ievamadara.glavecka@va.lv" && password === "123456") {
        this.setAuthenticated(true);
        router.push({ path: '/' });
      } else {
        alert("Incorrect login details");
      }
    },

    logout() {
      this.setAuthenticated(false);
      router.push({ path: '/login' });
    },

    toggleFavorite(songID) {
      const favoriteSongs = this.user.favoriteSongs;

      if (!favoriteSongs.includes(songID)) {
        favoriteSongs.push(songID);
      } else {
        const index = favoriteSongs.indexOf(songID);
        favoriteSongs.splice(index, 1);
      }

      this.user.favoriteSongs = favoriteSongs;
      this.saveFavoriteSongsToLocalStorage();
    },

    setAuthenticated(isAuthenticated) {
      this.authenticated = isAuthenticated;
      localStorage.setItem('is_authenticated', isAuthenticated);
    },

    saveFavoriteSongsToLocalStorage() {
      localStorage.favoriteSongs = JSON.stringify(this.user.favoriteSongs);
    },
  },
});

import './assets/main.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import NavigationComponent from '@/components/NavigationComponent.vue';
import AudioPlayerComponent from '@/components/AudioPlayerComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';

const app = createApp(App);

app.component('Navigation', NavigationComponent);
app.component('AudioPlayer', AudioPlayerComponent);
app.component('Header', HeaderComponent);

app.use(router);
app.use(createPinia());

app.mount('#app');

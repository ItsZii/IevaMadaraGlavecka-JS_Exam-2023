<template>
    <div id="login-view">
        <form class="login-form">
            <div class="wrapper-logo">
                <img src="@/assets/logo.svg" />
                <div>KRAKEN.FM</div>
            </div>
            <input id="input-email" placeholder="E-mail" v-model="email"/>
            <input id="input-password" type="password" placeholder="Password" v-model="password" />
            <button id="btn-submit" type="submit" :disabled="disable" @click="authorize">LOGIN</button>
        </form>
    </div>
</template>

<script>
    import { useAuthStore } from '../stores/auth';
    export default {
        data() {
            return {
                email: '',
                password: '',
            };
        },
        computed: {
            disable() {
                return this.email.trim().length == 0 || this.password.trim().length < 6;
            }
        },
        methods: {
            authorize() {
                useAuthStore().authenticate(this.email, this.password);
            },
        },
    }
</script>
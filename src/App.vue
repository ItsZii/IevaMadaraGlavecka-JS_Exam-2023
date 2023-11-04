<template>
    <!--  HEADER  -->
    <Header v-if="isAuth"></Header>
    <!--  HEADER END  -->

    <!--  BODY  -->
    <div id="section-body">
        <Navigation v-if="isAuth"></Navigation>
        <router-view class="section-router"></router-view>
    </div>
    <!--  BODY END  -->

    <!--  PLAYER  -->
    <div id="section-player" v-if="isAuth">
        <AudioPlayer></AudioPlayer>
    </div>
    <!--  PLAYER END  -->

</template>

<script>
    import { useAuthStore } from './stores/auth';

    export default {
        computed:{
            isAuth(){
                return useAuthStore().is_authenticated;
            }
        }
    }
</script>

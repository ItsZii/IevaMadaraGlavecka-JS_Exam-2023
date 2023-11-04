<template>
    <nav id="nav-main" class="wrapper-navigation">
        <ol>
            <li v-for="location in locations">
                <router-link :to="location.path" id="location">{{ location.name }}</router-link>
            </li> 
        </ol>

    </nav>
</template>
<script>
export default{
    data(){
        return{
            locations: [
                {name: 'SONGS', path: '/'},
                {name: 'ALBUMS', path: '/albums'},
                {name: 'ABOUT', path: '/about'},
            ]
        };
    }
}
</script>
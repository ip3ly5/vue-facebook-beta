<template>
    <div id="main">
        <Nav/>
        <div class="userContainer">
            <UserCard v-for="user in users" :key="user._id" :name="user.name" :profileImage="user.profileImage" :id="user._id"/>
        </div>
        </div>
    </div>
</template>
<script>
import Nav from './Nav';
import UserCard from './UserCard';

export default {
    name: 'Search',
    components: {
        Nav,
        UserCard
    },
    data () {
        return {
        }
    },
    computed: {
        users(){
            return this.$store.getters.getUsers
        }
    },
    mounted(){
            this.$store.dispatch('fetchUsers')
    }
}
</script>
<style scoped>

#main {
    position:relative;
    width:100%;
    justify-content:center;
}
.userContainer {
    top: 5rem;
    width:60%;
    margin: 1em auto;
}
</style>
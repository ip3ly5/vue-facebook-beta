<template>
    <div class="loginContainer">
    <h1>Login |<router-link :to="{name: 'signup'}"> Signup</router-link></h1>
        <form id="frmLogin" onsubmit="return false">
            <div class="inputPair">
                <label for="name">Username</label>
                <input name="username" type="text" placeholder="username">
            </div>
            <div class="inputPair">
                <label for="name">Password</label>
                <input name="password" type="password" placeholder="password">
            </div>
            <div class="standard-button" @click="Login">Login</div>
        </form>
    </div>
</template>
<script>
import Api from '@/services/api'


export default {
    name: 'login',
    data () {
        return {
        }
    },
    methods: {
        Login() {
            let form = new FormData(document.querySelector('#frmLogin'))
            Api().post('login', form).then(response=> {

                if(response.status != 200) {
                    console.log('error'); return
                }

                localStorage.jwt = response.data
                this.$router.push({name: 'main'})
                    
            })
        }
    },
    beforeRouteLeave(to, from, next){
        this.$store.dispatch('fetchUser')
        next()
    }
}
</script>
<style scoped>

input {
    margin:.25em;
}

.loginContainer {
    position:absolute;
    grid-gap: 1rem;
    width: 30%;
    padding: 1rem;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.5rem;
    margin: 0;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    display:flex;
    flex-direction:column;
}
</style>
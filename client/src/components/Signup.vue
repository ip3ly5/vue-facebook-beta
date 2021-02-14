<template>
    <div class="loginContainer">
    <h1>Signup |<router-link :to="{name: 'login'}"> Login</router-link></h1>
        <form id="frmLogin" onsubmit="return false">
            <div class="inputPair">
                <label for="name">Username</label>
                <input name="username" type="text" placeholder="username">
            </div>
            <div class="inputPair">
                <label for="email">Email</label>
                <input name="email" type="email" placeholder="email">
            </div>
            <div class="inputPair">
                <label for="name">Password</label>
                <input name="password" type="password" placeholder="password">
            </div>
            <div class="inputPair">
                <label for="date">What is your birthdate?</label>
                <input name="birthdate" type="date" placeholder="date">
            </div>
            <div class="standard-button" @click="Signup">Signup</div>
        </form>
    </div>
</template>
<script>
export default {
    name: 'signup',
    data () {
        return {
        }
    },
    methods: {
        async Signup() {
            let form = new FormData(document.querySelector('#frmLogin'))
            let connection = await fetch("http://127.0.0.1:80/signup", {
                method:"POST",
                body: form
            })
            this.$router.push({name: 'login'})
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
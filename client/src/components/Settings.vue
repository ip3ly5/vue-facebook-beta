<template>
    <div id="main"> 
        <Nav/>
        <div class="container">
            <h1>Settings</h1>
            <div class="form-section">
                <h2>Change Name</h2>
                <form id="frmDetails" onsubmit="return false">
                    <input name="name" type="name" placeholder="name" :value="user.name">
                    <div class="standard-button" @click="changeDetails">Change Details</div>
                </form>
            </div>
            <div class="form-section">
                <h2>Change Password</h2>
                <form id="frmChangePassword" onsubmit="return false">
                    <input name="oldPassword" type="password" placeholder="old password">
                    <input name="newPassword" type="password" placeholder="new password">
                    <input name="newPassword2" type="password" placeholder="retype password">
                    <div class="standard-button" @click="changePassword">Change Password</div>
                </form>
            </div>
            {{responseMessage}}
        </div>
    </div>
</template>
<script>
import Nav from './Nav';
import axios from 'axios';

export default {
    name: 'Settings',
    components: {
        Nav,

    },
    data () {
        return {
            responseMessage: '',
        }
    },
    computed: {
        user(){
            return this.$store.getters.getUser
        }
    },
    methods: {
        changeDetails(){
            let form = new FormData(document.querySelector('#frmDetails'))
            this.$store.dispatch('updateUser', form)
        },

        changePassword(){

        }
    }
}
</script>
<style scoped>

#main {
    position:relative;
    height:100vh;
}

.container input {
    margin:.25em 0;
}

.container {
    position:absolute;
    grid-gap: 1rem;
    width: 40%;
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

h1 {
    margin-bottom:1rem;
}

.form-section {
    margin-top: 1rem;
}
</style>
<template>
    <div id="main"> 
        <Nav/>
        <form class="profileContainer">
            <div class="profileHeader">
                <div class="profileImage" :class="{profileImageEditing:profileEditable}">
                    <input v-if="profileEditable" ref="uploadImage" type="file" id="imgUpload" name="image" style="display:none" @change="putImage"/> 
                    <img id="target" style="display:none">
                    <img class="formImage" id="chooseImg" :src="userProfilePicture" @click="changeProfileImage">
                </div>
                <div class="profileName">{{user.name}}</div>
                <div v-if="!user.bio" class="profileBio" :class="{profileBioEditing:profileEditable}" :contentEditable="profileEditable" ref="profileBio">Write something about yourself!</div>
                <div v-if="user.bio" class="profileBio" :class="{profileBioEditing:profileEditable}" :contentEditable="profileEditable" ref="profileBio">{{user.bio}}</div>
                <div class="profileEditButton" v-if="!profileEditable && profileIsUser" @click="toInputField">edit</div>
                <div class="profileEditButton" v-if="profileEditable && profileIsUser" @click="save">save</div>
            </div>
        </form>
        <div class="main-middle">
            <div class="posts">
                <Post v-for="post in posts.slice().reverse()" :key="post._id" :name="post.name" :body="post.body" :image="post.image" :profileImage="post.profileImage" :likes="post.likes" :user_id="post.user_id" />
            </div>
        </div>
    </div>
</template>
<script>
import Nav from './Nav';
import axios from 'axios';
import Api from '@/services/api'
import Post from './Post';
const path = require('path');

export default {
    name: 'Profile',
    components: {
        Nav,
        Post
    },
    data () {
        return {
            profileEditable: false,
            user: '',
            posts: []
        }
    },
    computed:{
        profileIsUser(){
            if (this.$route.params.id == this.$store.getters.getUser._id) return true
            else return false;
        },
        userProfilePicture(){
            if (this.user.profileImage) return `/static/${this.user.profileImage}`;
            else return '/static/default.jpg';
        }
    },
    watch: {
        '$route.path': 'refreshPage'
    },
    methods: {
        toInputField(){
            this.profileEditable = true;
        },

        save() {
            this.profileEditable = false;
            let newText = this.$refs.profileBio.innerText
            let oldText = this.user.bio
            let image = this.$refs.uploadImage
            let form = new FormData()
            if(image.files[0]) {
                form.append('profilePicture', image.files[0]);
            }
            
            if(newText != oldText) {
                form.append('bio', this.$refs.profileBio.innerText)
            }

            this.$store.dispatch('updateUser', form)
        },

        refreshPage() {
            this.$store.dispatch('fetchPostsById', form)
            this.fetchUserById()
            this.fetchPostsById()
        },
        
        fetchUserById() {
            Api().get(`api/users/${this.$route.params.id}`).then(response => {this.user = response.data})
        },

        fetchPostsById() {
            Api().get(`api/posts/user/${this.$route.params.id}`).then(response => {this.posts = response.data})
        },

        changeProfileImage() {
            if(this.profileEditable){
                this.$refs.uploadImage.click()
            }
        },

        putImage() {
            var target = document.getElementById("chooseImg");
            var src = this.$refs.uploadImage
            var fr = new FileReader();
            fr.onload = function(){
                target.src = fr.result;
            }
            fr.readAsDataURL(src.files[0]);
        }
    },

    mounted() {
        this.fetchUserById()
        this.fetchPostsById()
    }
}

</script>
<style scoped>

#main {
    position:relative;
    height:100vh;
}

.profileContainer {
    position:relative;
    top: 5rem;
    display:flex;
    width:100%;
    justify-content:center;
}

.profileHeader {
    flex-direction: column;
    width:60%;
    border-bottom: 1px solid #CCCED2;
    display:flex;
    justify-content:center;
    align-items:center;
}

.profileImage:before {
    content:"";
    display:block;
    padding-top: 100%;
}

.profileImage {
    margin-top:1em;
    position:relative;
    width: 20%;
    overflow: hidden;
    border-radius:50%;
}
.profileImage img {
    position: absolute;
    top: 0;
    left:0;
    right:0;
    bottom:0;
    object-fit: cover;
    width:100%;
}

.profileImageEditing {
    border: 2px dashed black;
    cursor:pointer;
}

.profileName {
    font-size:2em;
    font-weight:700;
}

.profileBio {
    color: #65676B;
    font-weight:500;
    font-size:1.2em;
    padding:1em;
    max-width:70%;
}

.profileBioEditing {
    background: #F0F2F5;
    box-shadow:inset 0px 0px 0px 1px #CED0D4;
}

.profileEditButton {
    color:#1DA1F2;
    cursor:pointer;
    font-weight:500;
}

</style>
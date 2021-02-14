<template>
    <div class="userContainer">
        <img class="thumbnail" :src="userProfilePicture" alt="">
        <router-link :key="$route.fullPath" :to="{name: 'profile', params: {id: id} }">{{name}}</router-link>
        <div v-if="!friendIsUser && !userAlreadyFriend && this.$route.name == 'search'" class="standard-button profileListButton" @click="makeFriends">Add friend</div>
        <div v-if="!friendIsUser && userAlreadyFriend && this.$route.name == 'search'" class="standard-button profileListButton">Friends!</div>
        <div v-if="this.$route.name=='main' || this.$route.name == 'profile'" class="chatIcon">
            <i class="fas fa-comments" @click="emitChatUser"></i>
        </div>
        <div v-if="!profileIsUser && this.$route.name=='main' || this.$route.name == 'profile'" class="onlineStatus" :class="{'online': isOnline}">
            <i class="fas fa-circle"></i>
        </div>
    </div>
</template>
<script>
import Api from '@/services/api'


export default {
    name: 'UserCard',
     props: {
        name: String,
        id: String,
        profileImage: String,
        friendObject: Object,
        onlineUsers: Array
    },
    data () {
        return {
            friendIsUser: false,
            userAlreadyFriend: false
        }
    },
    methods: {
        makeFriends(){
            let form = new FormData()
            form.append('friend_id', this.id)
            Api().post('api/friends', form).then(response=> { if(response.status == 200) this.userAlreadyFriend = true })
        },
        emitChatUser(){
            console.log(this.friendObject)
            this.$emit('startChat', this.friendObject)
        }
    },
    computed:{
        isOnline(){
            if(this.onlineUsers){
                if(this.onlineUsers.includes(this.id)) return true;
            }
        },
        addFriendCheck() {
            if (this.currentUser._id == this.id){
               this.friendIsUser = true;
            }
            
            this.currentUser.friends.forEach((friend) => {
                if(friend._id == this.id) {
                    this.userAlreadyFriend = true;
                }
            })
        },
        userIsOnline(){
            console.log(this.onlineUsers)
        },
        profileIsUser(){
            if (this.id == this.$store.getters.getUser._id) return true
            else return false;
        },
        userProfilePicture(){
            if (this.profileImage) return `/static/${this.profileImage}`;
            else return '/static/default.jpg';
        },
        currentUser(){
            return this.$store.getters.getUser
        }
    },
    mounted(){
        if(this.addFriendCheck) this.addFriendCheck();
    }
}
</script>
<style scoped>
.thumbnail {
    width:2em;
    height:2em;
    border-radius:50%;
}

.userContainer {
    position:relative;
    margin:1em auto;
    grid-gap: 1rem;
    width: 90%;
    padding: 1rem;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.5rem;
    display:flex;
    flex-direction:row;
    align-items:center;
}

.profileListButton {
    margin:0;
    margin-left:auto;
}

.chatIcon {
    margin-left:auto;
    color: #555;
    cursor:pointer;
}

.onlineStatus {
    color:grey;
    font-size:.5em;
}

.online {
    color:#31A24C;
}
</style>
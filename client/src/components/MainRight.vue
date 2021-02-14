<template>
    <div class="main-right">
        <div class="contact-list">
            <UserCard v-for="friend in friends" :key="friend._id" :name="friend.name" :profileImage="friend.profileImage" :onlineUsers="onlineUsers" :id="friend._id" :friendObject="friend" @startChat="startChat" />
        </div>
    <div class="chat-section">
        <ChatWindow v-for="chat in chats" :key="chat._id" :name="chat.name" :profileImage="chat.profileImage" :currentUser="currentUser" :socket="socket" :id="chat._id" @closeChat="closeChat" />
    </div>
    </div>
</template>

<script>
import UserCard from './UserCard';
import ChatWindow from './ChatWindow';
import io from 'socket.io-client'

export default {
    name: 'mainRight',
    components: {
        UserCard,
        ChatWindow
    },
    data () {
        return {
            socket: null,
            chats: [],
            onlineUsers: null
        }
    },
    methods: {
        startChat(friendObject){
            var objectExists = this.chats.filter(el => { return el._id == friendObject._id; }); 
            if(objectExists.length == 0 || array == undefined){
                this.chats.push(friendObject)
            } else {
                console.log('this chat is already open')
            }
        },

        closeChat(id){
            var filtered = this.chats.filter(function(el) { return el._id != id; }); 
            this.chats = filtered
        }
    },

    computed: {
        friends(){
            let user = this.$store.getters.getUser
            return user.friends
        },
        currentUser(){
            return this.$store.getters.getUser
        }
    },
      watch: {
          currentUser(){
            let self = this
            this.socket = io("http://localhost:80", {query: `user=${this.currentUser._id}`})
            this.socket.on("online_users", function (data) {
            self.onlineUsers = data;
            });
        }
    }
}
</script>
<style scoped>

main div.right{
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  position: relative;
  height: calc(100vh - 6rem);
  overflow: hidden;
  overflow-y: scroll;
}

div.contact-list{
  position: fixed;
  top: 5rem;
  left: 75vw;
  /* right: 0; */
  /* bottom: 0; */
  grid-template-columns: 1fr;
  grid-gap: 0.5rem;
  width: 25%;
  /* height: calc(100vh - 6rem); */
  height: calc(100vh - 5.5rem);
  /* background: rgba(0, 0, 0, 0.5); */
  /* overflow: hidden; */
  overflow-y: scroll;
  z-index: 1;
}

.chat-section {
    position:fixed;
    width:100%;
    height:30%;
    bottom:0;
    display:flex;
    z-index:900;
    pointer-events:none;
}

</style>
<template>
<div class="chatContainer">
    <div class="chatHeader">
        <img class="thumbnail" :src="userProfilePicture" alt="">
        <router-link :key="$route.fullPath" :to="{name: 'profile', params: {id: id} }">{{name}}</router-link>
        <div class="close" @click="$emit('closeChat', id)">
            <i class="fas fa-times"></i>
        </div>
    </div>
    <div class="chatBody" ref="chatBody">
        <div v-for="message in messages">
            <div v-html="message.message" :class="{'receivedMessage': message.receiver == id, 'sentMessage': message.receiver != id}"></div>
        </div>
    </div>
    <div class="chatFooter">
        <input class="chatInput" ref="chatMessage" v-on:keyup="sendMessage"/>
        <div class="send" @click="sendMessage">
            <i class="fas fa-paper-plane"></i>
        </div>
    </div>
</div>
</template>
<script>
import io from 'socket.io-client'
import Api from '@/services/api'

export default {
    name: 'ChatWindow',
     props: {
        name: String,
        body: String,
        id: String,
        profileImage: String,
        socket: Object,
        currentUser: Object
    },
    data () {
        return {
            messages: []
        }
    },
    methods: {
        sendMessage(e){
            if (e.keyCode === 13 || e.type === 'click') {

                let message = {
                    "sender": this.id,
                    "receiver": this.currentUser._id,
                    "message": this.$refs.chatMessage.value
                }

                this.socket.emit("send_message", message);
                this.messages.push(message)

                let form = new FormData()
                form.append('sender', this.id)
                form.append('receiver', this.currentUser._id)
                form.append('message', this.$refs.chatMessage.value)
                this.$refs.chatMessage.value = ""
                Api().post('api/chats', form).then(response=> { if(response.status == 200) console.log('message sent') })
            }
        }
    },
    computed: {
        userProfilePicture(){
            if (this.profileImage) return `/static/${this.profileImage}`
            else return '/static/default.jpg';
        },

        initializeMessages(){
            let self = this
            return this.messages = this.currentUser.chats.filter(el => { return el.sender == self.id || el.receiver == self.id })
        }
    },
    mounted(){
        this.socket.emit("chat_opened", this.id);
        this.$store.dispatch('fetchUser')

        let self = this;

        this.socket.on("message_received", function (data) {
            self.messages.push(data)
        });
        
        this.$nextTick(() => {
            this.initializeMessages()
        })
    }
}
</script>
<style scoped>

.chatContainer {
    display:flex;
    flex-direction:column;
    background: white;
    margin:0 2em;
    pointer-events:all;
}

.chatHeader {
    padding:.5em;
    display:flex;
    flex-direction:row;
    box-shadow: 0px 5px 5px -5px rgba(0, 0, 0, 0.3);
}

.chatBody {
    margin:.1em 0;
    height:100%;
    overflow-y:scroll;
}

.receivedMessage, .sentMessage {
    display:flex;
    border-radius:.75em;
    padding: .25em .5em;
    width:80%;
    margin: .2em .5em;
}

.receivedMessage {
    background:#E4E6EB;
    color:black;
    float:left;
}

.sentMessage {
    color:white;
    background:#1DA1F2;
    float:right;
}
.chatHeader a {
    margin: 0 .5em;
}

.chatInput {
    width:85%;
}

.send {
    width:15%;
    display:flex;
    align-items:center;
    justify-content:center;
    color:#1DA1F2;
    cursor:pointer;
}

.chatFooter {
    padding:.5em;
    width:100%;
    display:flex;
}

.thumbnail {
    width:2em;
    height:2em;
    border-radius:50%;
}

div.close {
    color:#555;
    cursor:pointer;
    margin-left:auto;
}

</style>
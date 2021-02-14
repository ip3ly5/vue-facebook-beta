<template>
<div class="nav">
    <nav>
        <div class="left">
            <div class="logo">
                <i class="fas fa-atom"></i></i> Spacebook
            </div>
            <div>
                <form>
                <div>                
                    <i class="fas fa-search" @click="search"></i>
                    <input type="text">
                </div>
                </form>
            </div>
            </div>

            <div class="middle">
            <div :class="{'active': $route.name === 'main'}">
                <router-link :to="{name: 'main'}">
                    <i class="fas fa-home"></i>
                </router-link>
            </div>
            <div>
                <i class="fas fa-video"></i>
            </div>
            <div>
                <i class="fas fa-shopping-basket"></i>
            </div>            
            </div>

            <div class="right">
            <div class="profile-button" :class="{'profile-active': $route.name === 'profile'}">
                <img class="thumbnail" :src="userProfilePicture" alt="">
                <router-link :key="$route.fullPath" :to="{name: 'profile', params: {id: user._id} }" >
                    {{user.name}}      
                </router-link>
            </div>
            <div>
                <i class="far fa-comment-alt"></i>
                <div class="chat-counter">1</div>       
            </div>
            <div>
                <i class="far fa-bell"></i> 
                <div class="notification-counter">5</div>         
            </div>
            <div @click="toggleUserDropdown = !toggleUserDropdown">
                <i class="fas fa-user"></i>                      
            </div>
        </div>
    </nav>
     <div v-if="toggleUserDropdown" id="userDropdown">
        <ul>
            <router-link :key="$route.fullPath" :to="{name: 'profile', params: {id: user._id} }">Profile</router-link>
        </ul>
        <ul><router-link :to="{name: 'settings'}">Settings</router-link></ul>
        <ul @click="logout"><a>Logout</a></ul>
    </div>  
</div>

</template>
<script>
export default {
    name: 'Nav',
    data () {
        return {
            toggleUserDropdown: false,
        }
    },
    computed: {
        user(){
            return this.$store.getters.getUser
        },
        userProfilePicture(){
            if (this.user.profileImage) return `/static/${this.user.profileImage}`
            else return '/static/default.jpg';
        }
    },

    methods: {
        search() {
            this.$router.push({name: 'search'})
        },

        logout(){
            localStorage.removeItem('jwt');
            this.$router.push({name: 'login'})
        }
    },
    mounted(){
        this.$store.dispatch('fetchUser')
    }
}
</script>
<style scoped>

nav {
  position: fixed;
  display: grid;
  grid-template-columns: 25fr 40fr 10fr;
  grid-gap: 2rem;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 4rem;
  padding: 0px 2vw;
  font-size: 1.5rem;
  color: #555;
  background: white;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  z-index: 1;
}
nav div.active{
  border-bottom: 0.2rem solid #1da1f2;
}
nav div.left{
  display: grid;
  grid-template-columns: 5fr 10fr;
  grid-gap: 1rem;
  align-items: center;
}
nav div.left div.logo{
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  grid-gap: 0.5rem;
  font-weight: 400;
  color: #1da1f2;
}
nav div.left form > div{
  position: relative;
}
nav div.left form > div > i{
  position: absolute;
  right: 0.5rem;
  margin-top: 0.8rem;
  font-size: 1rem;
  cursor:pointer;
}
nav div.left form > div > input{
  padding-right: 1.8rem;
}
nav div.middle{
  display: grid;
  grid-template-columns: 10fr 10fr 10fr;
  justify-items: center;
  grid-gap: 1rem;
  align-items: center;
}
nav div.middle > div{
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  align-items: center;

  position: relative;
  width: 100%;
  height: 100%;
}
nav div.right{
  display: grid;
  grid-template-columns: 8fr 8fr 1fr 1fr 8fr;
  align-items: center;
  grid-gap: 2rem;
  align-items: center;
}
nav div.right > div{
  position: relative;
}
nav div.right > div:last-child{
  text-align: right;
}
nav div.chat-counter{
  display: grid;
  justify-content: center;
  align-content: center;

  position: absolute;
  top: -0.6rem;
  right: -1rem;

  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background: #f02849;
  border-radius: 50%;
}
nav div.notification-counter{
  display: grid;
  justify-content: center;
  align-content: center;

  position: absolute;
  top: -0.6rem;
  right: -1rem;

  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background: #f02849;
  border-radius: 50%;
}

#userDropdown {
    position:fixed;
    width:14rem;
    right:0;
    top:3em;
    z-index:3;
    background: white;
    box-shadow: 3px 0px 8px -11px rgba(0, 0, 0, 0.3), -3px 11px 8px -6px rgba(0, 0, 0, 0.3);
    border-bottom-left-radius: .5em;
    border-bottom-right-radius: .5em;
    padding:.5rem 1rem;
}

#userDropdown ul a {
    display:flex;
    margin: .5rem 0;
}
 .thumbnail {
     margin-right: .25em;
     border-radius:50%;
     width:.9em;
     height:.9em;
     position:relative;
 }

.profile-button {
    font-weight:500;
    align-items:center;
    padding: .1rem .5rem;
    border-radius: 18px;
    display:flex;
}

.profile-button:hover {
    background:#E4E6EB;

}

.profile-active {
    background:#E7F3FF;
    color: #3B8BF4;
}
.fa-user:hover {
    cursor:pointer;
    color:grey;
}


</style>
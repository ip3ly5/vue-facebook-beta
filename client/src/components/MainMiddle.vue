<template>
    <div class="main-middle">

        <div class="mind">
        <div>
            <form>
                <input ref="newPost" v-model="newPost" type="text" :placeholder="user.name + ', what are you up to?'">
                    <div>
                        <input ref="uploadImage" type="file" id="imgUpload" name="image" style="display:none" @change="putImage"/> 
                        <img v-show="imageChosen" class="formImage" id="chooseImg" @click="setImage">
                    </div>
                <div class="standard-button" @click="savePost">Post</div>
            </form>
        </div>
        <div>
            <div class="photoVideoButton" @click="setImage"><i class="far fa-image photo"></i> Photo/Video</div>
            <div><i class="fas fa-user-tag tag"></i> Tag Friend</div>
        </div>
        </div>
        <div class="posts">
            <Post v-for="post in posts.slice().reverse()" :key="post._id" :name="post.name" :body="post.body" :image="post.image" :profileImage="post.profileImage" :likes="post.likes" :user_id="post.user_id" />
        </div>
    </div>    
</template>

<script>
import Post from './Post';


export default {
  name: 'mainMiddle',
  components: {
    Post
  },

  data() {
    return {
      newPost: '',
      imageChosen: false
    }
  },

  computed: {
    user() {
      return this.$store.getters.getUser
    },
    posts() {
      return this.$store.getters.getPosts
    }
  },
  methods: {
    setImage() {
        this.$refs.uploadImage.click()
    },

    putImage() {
            var target = document.getElementById("chooseImg");
            var src = this.$refs.uploadImage
            var fr = new FileReader();
            fr.onload = function(){
                target.src = fr.result;
            }
            fr.readAsDataURL(src.files[0]);
            this.imageChosen = true;
        },

    savePost() {
      if(this.$refs.uploadImage.files[0] || this.newPost) {
        let form = new FormData()
        if(this.$refs.newPost.value) {
            form.append('newPost', this.$refs.newPost.value)
        }
        if(this.$refs.uploadImage.files[0]) {
            form.append('newImage', this.$refs.uploadImage.files[0])
        }
        this.$store.dispatch('addPost', form)
        this.imageChosen = false;
        this.newPost = '';
      }
    }
  },
  mounted() {
    this.$store.dispatch('fetchPosts')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.photoVideoButton {
    cursor:pointer;
}

.postImage {
    width:100%;
    height:100%;
    padding:1em;
    overflow:hidden;
}

.postImage img {
    width:100%;
    height:100%;
    cursor:pointer;
}

#chooseImg {
    width:100%;
    display:flex;
    margin: .5em auto;
    cursor: pointer;
}
</style>

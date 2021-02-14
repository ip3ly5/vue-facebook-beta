<template>
    <div class="post" v-if="!deleted">
        <div class="mini-profile">
            <div>
                <div class="postHeader">
                    <div class="userProfileContainer">
                        <img :src="userProfilePicture" alt="">
                        <router-link :key="$route.fullPath" :to="{name: 'profile', params: {id: user_id} }">{{name}}</router-link>
                    </div>
                    <div class="postOptions" v-if="this.user_id == this.user._id">
                        <div v-show="!postEditing"><i class="editIcon fas fa-edit" @click="postEditing = !postEditing"></i></div>
                        <div v-show="postEditing"><i class="submitIcon fas fa-check" @click="postEditing = !postEditing; updatePost();"></i></div>
                        <div><i class="deleteIcon fas fa-trash-alt" @click="deletePost"></i></div>
                    </div>
                </div>

                <div class="postBody" ref="changedBody" :class="{postBodyEditing:postEditing}" :contentEditable="postEditing">{{body}}</div>
                <input ref="uploadChangedImage" type="file" id="imgUpload" name="image" style="display:none" @change="putImage"/> 
                <img v-if="this.image" ref="chooseChangedImage" class="postImage" :class="{imageEditable:postEditing}" @click="setImage" :src="getImgUrl(image)" alt="">
                <img ref="uploadDefaultImage" v-if="!this.image && this.postEditing" class="postImage" :class="{imageEditable:postEditing}" src="/static/uploadImage.svg" alt="" @click="setImage">
                <div class="postFooter" @click="likeButton">
                    <i class="likeIcon fas fa-thumbs-up" :class="{liked:hasLiked}"></i>
                    <div :class="{liked:hasLiked}">Like</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Api from '@/services/api'

export default {
    name: 'Post',
    props: {
        name: String,
        body: String,
        image: String,
        user_id: String,
        profileImage: String,
        likes: Array
    },

    data () {
        return {
            postEditing: false,
            deleted: false,
            hasLiked: null,
            showImage: false
        }
    },
    methods: {

        getImgUrl(image) {
            return require('../../static/'+image)
        },
        deletePost() {
            Api().delete(`api/posts/${this.$vnode.key}`).then(response => { if(response.status == 200) this.deleted = true; })
        },
        updatePost(){
            this.postEditing = true;
        },
        setImage() {
            if(this.postEditing) this.$refs.uploadChangedImage.click()
        },
        putImage() {
            var target
            if(this.$refs.uploadDefaultImage){
                target = this.$refs.uploadDefaultImage
                this.showImage = true
                this.image = true
            } else {
                target = this.$refs.chooseChangedImage
            }
            var src = this.$refs.uploadChangedImage
            var fr = new FileReader();
            fr.onload = function(){
                target.src = fr.result;
            }
            fr.readAsDataURL(src.files[0]);
            },
        updatePost(){
            if(this.$refs.uploadChangedImage.files[0] || this.$refs.changedBody.innerHTML != this.body) {
                let form = new FormData()
                if(this.$refs.changedBody.innerHTML) {
                    form.append('changedBody', this.$refs.changedBody.innerHTML)
                }
                if(this.$refs.uploadChangedImage.files[0]) {
                    form.append('changedImage', this.$refs.uploadChangedImage.files[0])
                }
                Api().put(`api/posts/${this.$vnode.key}`, form).then(response => {console.log(response)})
            }
        },

        likeButton(){
            if(this.hasLiked){
                this.deleteLike()
            } else {
                this.likePost()
            }
        },

        likePost(){
            Api().put(`api/posts/${this.$vnode.key}/like`).then(response => { if(response.status = 200 ){ this.hasLiked = true}})
        },

        deleteLike(){
            Api().delete(`api/posts/${this.$vnode.key}/like`).then(response => { if(response.status = 200 ){ this.hasLiked = false}})

        }
    },
    computed: {
        userProfilePicture(){
            if (this.profileImage) return `/static/${this.profileImage}`
            else return '/static/default.jpg';
        },

        user() {
            return this.$store.getters.getUser
        }
    },

    mounted(){
        this.hasLiked = this.likes.includes(this.user._id)
    }
}
</script>
<style scoped>
 .thumbnail {
    width:1em;
    height:1em;
 }

 .postImage {
    width:100%;
 }

 .deleteIcon, .editIcon, .submitIcon, .likeIcon, .postFooter {
    color: #555555;
    float: right;
    cursor: pointer;
    margin: 0 .25em;
 }

 .imageEditable {
    border: 2px dashed black;
    cursor:pointer;
 }

 .postBodyEditing {
    background: #F0F2F5;
    box-shadow: inset 0px 0px 0px 1px #CED0D4;
}


.postBody {
    color: #65676B;
    font-weight:500;
    font-size:1.2em;    
    padding:1em;
    max-width:100%;
    margin: .5em;
}


.postHeader {
    display:flex;
    padding:1em;
    justify-content:space-between;
    width:100%;
}

.postFooter {
    display:flex;
    align-items: center;
    cursor: pointer;
    margin:1em;
}

.liked {
    color:#1DA1F2;
}


.userProfileContainer {
    display:flex;
    width:40%;
}
.userProfileContainer img {
    width: 3rem;
    height: 3rem;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 50%;
}

.userProfileContainer a {
    display:flex;
    margin: auto .5em;
}

.postOptions{
    display:flex;
}

</style>

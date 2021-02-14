import Vuex from 'vuex'
import Vue from 'vue'
import Api from '@/services/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: [], 
    users: [],
    posts: []
  },
  mutations: {
    setUser:(state, user) => {state.user = user},
    setUsers:(state, users) => {state.users = users},
    setPosts:(state, posts) => {state.posts = posts},
    appendPost:(state, post) => {state.posts.push(post)}
  },
  getters: {
    getUser: (state) => (state.user),
    getUsers: (state) => (state.users),
    getPosts: (state) => (state.posts)
  },
  actions: {
        async fetchUser ({commit}) {
            return Api().get('api/user').then(response => {commit('setUser', response.data)})
        },

        async fetchUsers ({commit}) {
            return Api().get('api/users').then(response => {commit('setUsers', response.data)})
        },

        async updateUser ({commit}, payload){
            return Api().put('api/user/', payload).then(response=> {commit('setUser', response.data)})
        },

        async fetchPosts ({commit}) {
            return Api().get('api/posts/').then(response => {commit('setPosts', response.data)})
        },

        async fetchPostsById ({commit}, id) {
            return Api().get(`api/posts/${id}`).then(response => {commit('setPosts', response.data)})
        },

        async addPost ({commit}, payload){
            return Api().post('api/posts/', payload).then(response=> {commit('appendPost', response.data)})
        },
    }
})

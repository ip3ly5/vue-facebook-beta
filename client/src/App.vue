<template>
  <div id="app">
    <router-view :key="$route.path"/>
    <mainRight v-if="this.$route.name=='main' || this.$route.name == 'profile'"/>

  </div>
</template>

<script>
import mainRight from './components/MainRight';

export default {
    name: 'App',
    components: {
        mainRight
    }
}

</script>

<style>
*{ margin: 0px; padding: 0px; box-sizing: border-box; }

body{
  width: 100%;
  font-size: 1.1rem;
  font-weight: 300;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: rgba(0, 0, 0, 0.02);
}

input{
  width: 100%;
  height: 2.5rem;
  padding: 0px 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  outline: none;
}



.standard-button {
  background-color: white; /* Green */
  border: none;
  color: grey;
  border: 1px solid #CCCCCC;
  padding: 1em 2em;
  text-align: center;
  text-decoration: none;
  display: block;
  margin: 1em 6em 1em 6em;
  font-size: 16px;
  transition-duration: 0.4s;
  cursor: pointer;
}

.standard-button:hover {
    background-color: #CCCCCC;
    color: white;
}

.inputPair > label{
	display: block;
	float: left;
	margin-top: -.2em;
	background: #FFFFFF;
	height: 1em;
	padding: 0 0 0 .4em;
	color: #B9B9B9;
	font-size: 14px;
	font-family: Arial, Helvetica, sans-serif;
}

a { 
    color: #555;
    text-decoration: none;
    cursor:pointer;
}

a:hover {
    color:#1DA1F2;
}

::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

div.main-middle{
  position: relative;
  top: 5rem;
  left: 25vw;
  width: 50vw;
  padding: 0 2rem;
}

div.main-middle .mind{
  width: 100%; 
  padding: 1rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  
}

div.main-middle .mind > div:first-child{
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 1rem;
}

div.main-middle .mind form input{
  width: 100%;
  background: rgba(0, 0, 0, 0.05);
}

div.main-middle .mind > div:last-child{
  display: flex;
  justify-items: center;
  justify-content:space-around;
  padding-top: 1rem;
}

div.main-middle .photo{
  color: #45bd62;
}

div.main-middle .tag{
  color: #1da1f2;
}

div.main-middle .feel{
  color: #f7b928;
}

div.main-middle div.posts{
  display: grid;
  grid-gap: 1rem;
  padding: 1rem 0px;
}

div.main-middle div.post{
  display: grid;
  grid-gap: 1rem;
  width: 100%; 
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
}

</style>

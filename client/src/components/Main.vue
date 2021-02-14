<template>
    <div id="main"> 
        <Nav/>
        <mainMiddle/>
        <mainLeft/>
    </div>
</template>
<script>
import Nav from './Nav';
import axios from 'axios';
import mainLeft from './MainLeft';
import mainMiddle from './MainMiddle';

export default {
    name: 'Main',
    components: {
        Nav,
        mainLeft,
        mainMiddle
    },
    data () {
        return {
        }
    }
}
</script>
<style scoped>

</style>
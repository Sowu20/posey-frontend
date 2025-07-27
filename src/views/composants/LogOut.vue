<template>
  <div class="logout">
      <button type="button" class="btn btn-danger" @click="logout">Déconnexion</button>
  </div>
</template>

<script>
  // import axios from 'axios';
  export default {
      methods:{
          async logout(){
              localStorage.removeItem('token');
              this.$router.push('/login');
              // return await axios.post('/logout').then(response => {
              //     if (response.data.success) {
              //         // localStorage.removeItem('user');
              //         localStorage.removeItem('token');
              //         this.$router.push('/login');
              //     }else{

              //     }
              // });
          }
      },
      name: "logoutButton",
  }
</script>
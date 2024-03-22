<template>
  <div>
    <div v-if="authenticated">
      <h1>Hello World</h1>
      <a href="#" @click.prevent="showMessage">Click Me</a>
      <p v-if="message">{{ message }}</p>
      <div>
        <!-- Link to protected sources -->
        <a href="#" @click.prevent="fetchProtected">Access Protected Content</a>
        <p v-if="protectedContent">{{ protectedContent }}</p>
      </div>
    </div>
    <div v-else>
      <!-- Login list -->
      <form @submit.prevent="login">
        <input v-model="username" placeholder="Username" />
        <input type="password" v-model="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      authenticated: false,
      message: '',
      protectedContent: ''
    };
  },
  created(){
    this.checkSession();
  },
  methods: {
    login() {
      // send login request
      fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password
        }),
        credentials: 'include' // make sure with credentials（cookie）
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Invalid account or password!');
        }
      })
      .then(data => {
        if (data.authenticated) {
          this.authenticated = true;
        } else {
          throw new Error('Invalid account or password!');
        }
      })
      .catch(error => {
        alert(error.message);
      });
    },
    showMessage() {
      this.message = 'You are here';
    },
    fetchProtected() {
      // request protected sources
      fetch('http://localhost:3000/protected', {
        credentials: 'include' // make sure with cookie
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          throw new Error('ession expired. Please login again.');
        } else {
          throw new Error('An error occurred.');
        }
      })
      .then(data => {
        this.protectedContent = data.content;
      })
      .catch(error => {
        this.authenticated = false; // 重置认证状态
        this.message = ''; // 清除之前的消息
        alert(error.message);
        // 可以在这里添加重定向到登录页面的逻辑
      });
    },
    checkSession(){
      fetch('http://localhost:3000/check-session', {
        credentials: 'include'
      })
      .then(response =>{
        if (response.ok){
          return response.json();
        } else{
          throw new Error('Session not active');
        }
      })
      .then(data=>{
        this.authenticated = data.authenticated;
      })
      .catch(error=>{
        console.error(error.message);
        this.authenticated = false;
      });
    }
  }
}
</script>


<template>
  <form @submit.prevent="handleSubmit" class="auth-form">
    <h3>Login</h3>
    <input type="email" placeholder="Email" v-model="email" />
    <input type="password" placeholder="Password" v-model="password" />
    <div class="error" v-if="error">{{ error }}</div>
    <div class="links">
      <button v-if="!isPending" class="btn">Log in</button>
      <button v-if="isPending" disabled class="spinner"></button>
      <router-link class="create-account" :to="{ name: 'Signup' }"
        >Create an account</router-link
      >
    </div>
  </form>

  <div class="suggestion">
    <h4>To test this app, you can use:</h4>
    <p>email : <u>johndoe@google.com</u></p>
    <p>password : <u>test1234</u></p>
  </div>
</template>

<script>
import useLogin from "@/composables/useLogin";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const { error, login, isPending } = useLogin();
    const router = useRouter();
    const email = ref("");
    const password = ref("");

    const handleSubmit = async () => {
      const res = await login(email.value, password.value);
      if (!error.value) {
        console.log("user logged in");
        router.push({ name: "Home" });
      }
    };

    return { email, password, error, isPending, handleSubmit };
  },
};
</script>

<style>
.auth-form {
  max-width: 400px;
  margin: 60px auto 0;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 1px 2px 3px rgba(50, 50, 50, 0.05);
  border: 1px solid var(--secondary);
  background: white;
}

.auth-form input {
  border: none;
  display: block;
  margin: 20px auto;
  border-bottom: 1px solid var(--secondary);
  width: 100%;
  padding: 10px;
}

.auth-form .links {
  display: flex;
  align-items: center;
}
.create-account {
  margin-left: auto;
  text-decoration: underline;
  font-size: 14px;
}

.create-account:hover {
  color: black;
}

.suggestion {
  max-width: 400px;
  margin: 60px auto 0;
  /* text-align: center; */
}
</style>
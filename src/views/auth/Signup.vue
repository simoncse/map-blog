<template>
  <form @submit.prevent="handleSubmit" class="auth-form">
    <h3>Sign up</h3>
    <input type="text" placeholder="Display Name" v-model="displayName" />
    <input type="email" placeholder="Email" v-model="email" />
    <input type="password" placeholder="Password" v-model="password" />
    <div class="error" v-if="error">{{ error }}</div>
    <div class="links">
      <button v-if="!isPending" class="btn">Sign up</button>
      <button v-if="isPending" disabled class="spinner"></button>
    </div>
  </form>
</template>

<script>
import useSignup from "@/composables/useSignup";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const { error, signup, isPending } = useSignup();
    const displayName = ref("");
    const email = ref("");
    const password = ref("");
    const handleSubmit = async () => {
      const res = await signup(email.value, password.value, displayName.value);
      if (!error.value) {
        console.log("user signed up");
        router.push({ name: "Home" });
      }
    };
    return { email, password, displayName, isPending, error, handleSubmit };
  },
};
</script>

<style>
</style>
<template>
  <div class="navbar">
    <nav>
      <h1><router-link :to="{ name: 'Home' }">Map Blog</router-link></h1>
      <div class="links">
        <div v-if="user" class="user-actions">
          <div class="greeting">Hi there, {{ user.displayName }}</div>
          <button class="btn" @click="handleClick">Logout</button>
        </div>
        <div v-else>
          <router-link class="btn" :to="{ name: 'Signup' }">Signup</router-link>
          <router-link class="btn" :to="{ name: 'Login' }">Login</router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import getUser from "../composables/getUser";
import useLogout from "../composables/useLogout";
import { setActiveTab } from "./sideview/state";
export default {
  setup() {
    const { user } = getUser();
    const { logout } = useLogout();
    const handleClick = async () => {
      await logout();
      setActiveTab("PlaceList");
      console.log("Logged Out");
    };
    return { handleClick, user };
  },
};
</script>

<style>
.navbar {
  background: white;
  padding: 6px 10px;
}

nav {
  display: flex;
  align-items: center;
  margin: 0 auto;
}

nav .links {
  margin-left: auto;
}

.user-actions {
  display: flex;
  align-items: center;
}

nav .links a {
  margin-left: 16px;
  font-size: 14px;
}

.greeting {
  font-size: 14px;
  margin: 0 16px;
  padding-left: 16px;
}
</style>
<template>
  <v-app>
    <!-- <v-layout> -->
    <NavigationDrawer />
    <!-- <Footer /> -->
    <v-main class="mb-1">
      <router-view @eventname="updateparent" :key="$route.fullPath"></router-view>
    </v-main>
    <!-- </v-layout> -->
  </v-app>
</template>
<script>
import NavigationDrawer from "./views/Navigation/NavigationDrawer";
import Footer from "./views/Navigation/Footer.vue";
import { socket } from "./store/socket";
export default {
  name: "App",
  components: {
    NavigationDrawer,
    Footer,
  },
  watch: {},
  data() {
    return {
      valid: false,
      socket: socket(),
    };
  },
  created() {},
  mounted() {
    this.socket.connect();
  },
  beforeMount() {
    this.socket.disconnect();
  },
  methods: {
    updateparent(val) {
      this.valid = val;
    },
  },
  computed: {},
};
</script>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue"

const discordOAuthUrl = ref("https://discord.com/oauth2/authorize?client_id=1256137976099110955&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord%2Fcallback&scope=guilds+identify");

</script>

<template>
  <div>
  	<NuxtLink :to="discordOAuthUrl">
  		Login with Discord
  	</NuxtLink>
  </div>
</template>

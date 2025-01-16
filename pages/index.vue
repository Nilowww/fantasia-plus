<template>
  <div>Homepage</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
definePageMeta({
  middleware: "authenticated",
});


const supabase = useSupabaseClient();
const router = useRouter();

const logOut = async () => {
  await supabase.auth.signOut();
  router.push('/login');
};

logOut();
</script>

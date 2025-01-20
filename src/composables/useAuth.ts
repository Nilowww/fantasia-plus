import { ref, reactive, computed } from "vue";
import { navigateTo } from "nuxt/app";

export function useAuth() {
  const supaAuth = useSupabaseClient().auth;
  const form = ref();

  const credentials = reactive({
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const rememberMe = ref(false);
  const loading = ref(false);
  const errorMessage = ref("");
  const showPassword = ref(false);

  const passwordType = computed(() => (showPassword.value ? "text" : "password"));

  const login = async () => {
    // Validate form before proceeding
    const { valid } = await form.value?.validate();
    if (!valid) return;

    loading.value = true;
    const { error } = await supaAuth.signInWithPassword(credentials);
    loading.value = false;

    if (error) {
      errorMessage.value = error.message;
    } else {
      navigateTo("/");
    }
  };

  const signUp = async () => {
    // Validate form before proceeding
    const { valid } = await form.value?.validate();
    if (!valid) return;

    if (credentials.password !== credentials.passwordConfirm) {
      errorMessage.value = "Passwords do not match";
      return;
    }

    loading.value = true;
    const { error } = await supaAuth.signUp({
      email: credentials.email,
      password: credentials.password,
    });
    loading.value = false;

    if (error) {
      errorMessage.value = error.message;
    } else {
      navigateTo("/");
    }
  };

  function togglePasswordVisibility() {
    showPassword.value = !showPassword.value;
  }

  return {
    form,
    credentials,
    rememberMe,
    loading,
    errorMessage,
    passwordType,
    showPassword,
    login,
    signUp,
    togglePasswordVisibility,
  };
}
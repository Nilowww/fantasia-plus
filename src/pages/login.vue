<template>
  <div class="login-wrapper">
    <!-- Logo -->
    <v-row align="center" justify="center" no-gutters class="flex-column">
      <v-col cols="12">
        <v-img
          src="/assets/fantasia-logo.png"
          contain
          height="200"
          width="200"
          class="mx-auto logo-animation mt-n4"
        />
      </v-col>

      <!-- Login card -->
      <v-col cols="12" sm="8" md="6" lg="4" xl="3" class="mt-n8">
        <v-card class="login-card mx-auto" elevation="24" max-width="100%">
          <v-card-title>
            <h1 class="text-h5 font-weight-bold mb-0">Log in</h1>
            <p class="text-subtitle-1 mb-3">Enter your details to get started</p>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" @submit.prevent="login">
              <v-text-field
                v-model="credentials.email"
                label="Email"
                type="email"
                required
                :rules="[ruleRequired, ruleEmail]"
                class="mb-3"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                color="white"
              />
              <v-text-field
                v-model="credentials.password"
                :type="passwordType"
                label="Password"
                required
                :rules="[ruleRequired, rulePassLen]"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="togglePasswordVisibility"
                variant="outlined"
                color="white"
              />
              <v-alert
                v-if="errorMessage"
                type="error"
                class="mb-4"
                variant="tonal"
              >
                {{ errorMessage }}
              </v-alert>
              <v-checkbox
                v-model="rememberMe"
                label="Keep me signed in"
                class="mb-6"
                hide-details
                color="white"
              />
              <v-btn
                type="submit"
                :loading="loading"
                color="primary"
                block
                class="submit-btn mb-6"
                size="x-large"
                elevation="8"
              >
                <span class="text-button">CONTINUE</span>
              </v-btn>
              <v-divider class="mb-4" />
              <p class="text-body-2 text-center">
                New to Fantasia?
                <nuxt-link
                  to="/register"
                  class="font-weight-bold text-primary text-decoration-none sign-up-link"
                >
                  Sign up now
                </nuxt-link>
              </p>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "../composables/useAuth";
const { ruleEmail, rulePassLen, ruleRequired } = useFormRules();
const {
  form,
  credentials,
  rememberMe,
  loading,
  errorMessage,
  passwordType,
  showPassword,
  login,
  togglePasswordVisibility,
} = useAuth();

useHead({
  title: 'Fantasia+ | Log In',
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }
  ]
})
</script>

<style scoped>
.login-wrapper {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    150deg,
    rgb(20, 20, 20) 15%,
    rgb(0, 51, 102) 50%,
    rgb(0, 23, 46) 75%
  );
}

.logo-animation {
  animation: logo-entrance 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes logo-entrance {
  0% {
    opacity: 0;
    transform: translateY(-50px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-card {
  border-radius: 8px;
  background: rgba(19, 19, 19, 0.95);
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: card-entrance 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s backwards;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes card-entrance {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.submit-btn {
  font-weight: bold;
  letter-spacing: 1.5px;
  background: rgb(0, 114, 210) !important;
  transition: all 0.3s ease !important;
  height: 54px !important;
}

.submit-btn:hover {
  background: rgb(0, 134, 241) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 114, 210, 0.4) !important;
}

.text-button {
  font-size: 15px;
  font-weight: 600;
}

.sign-up-link {
  color: rgb(0, 114, 210) !important;
  transition: color 0.2s ease;
}

.sign-up-link:hover {
  color: rgb(0, 134, 241) !important;
}

:deep(.v-field) {
  border-radius: 4px;
  background: rgba(31, 31, 31, 0.7) !important;
}

:deep(.v-label) {
  color: rgba(255, 255, 255, 0.7);
}

:deep(.v-field__input) {
  color: white !important;
}

:deep(.v-checkbox .v-label) {
  color: rgba(255, 255, 255, 0.9);
}

.v-card-title {
  color: white;
}

.text-body-2 {
  color: rgba(255, 255, 255, 0.7);
}

.v-divider {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

@media (max-width: 600px) {
  .login-card {
    padding: 16px;
    margin: 16px;
  }

  .v-card-title {
    padding-top: 16px !important;
  }

  .v-card-text {
    padding: 16px !important;
  }
}
</style>

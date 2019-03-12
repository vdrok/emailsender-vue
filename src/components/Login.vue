<template>
  <b-container class="hv-100">
    <b-row class="justify-content-center h-100 align-items-center">
        <b-card title="Log in"
                style="width: 500px;"
                class="text-center loginCard card-block"
        >
          <b-alert show variant="danger" v-if="errorHandler">{{errorHandler}}</b-alert>
          Need an account? <b-link to="/register">Create an account</b-link>
          <b-form @submit="onLogin" class="text-left">
            <b-form-group
                    id="email"
                    label="Email"
                    label-for="emailInput"
                    :invalid-feedback="invalidEmail"
                    :valid-feedback="validFeedback"
                    :state="stateEmail"
            >
              <b-form-input id="emailInput" :state="stateEmail" v-model.trim="email" type="email"></b-form-input>
            </b-form-group>
            <b-form-group
                    id="password"
                    label="Password"
                    label-for="passwordInput"
                    :invalid-feedback="invalidPassword"
                    :valid-feedback="validFeedback"
                    :state="statePassword"
            >
              <b-form-input id="passwordInput" :state="statePassword" v-model.trim="password" type="password"></b-form-input>
            </b-form-group>
            <b-form-checkbox plain id="keepMeLoggedIn"
                             v-model="keepMeLoggedIn">
              Keep me logged in
            </b-form-checkbox>
            
            <b-button block type="submit" variant="primary" class="loginButton">Log in</b-button>
          </b-form>
        </b-card>
    </b-row>
  </b-container>
</template>

<script>
export default {
    name: 'Login',
    data () {
      return {
          email: '',
          password: '',
          keepMeLoggedIn: false
      }
    },
    computed: {
        stateEmail () {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(this.email).toLowerCase());
        },
        statePassword () {
            return this.password.length >= 2
        },
        invalidEmail () {
            if (this.email.length > 2) {
                return ''
            } else if (this.email.length > 0) {
                return 'Enter at least 2 characters'
            } else {
                return 'Please enter something'
            }
        },
        invalidPassword () {
            if (this.password.length > 2) {
                return ''
            } else if (this.password.length > 0) {
                return 'Enter at least 2 characters'
            } else {
                return 'Please enter something'
            }
        },
        validFeedback () {
            return this.state === true ? 'Thank you' : ''
        },
        errorHandler() {
            return this.$store.state.authentication.errorText;
        }
    },
    methods: {
        onLogin(e){
            e.preventDefault();
            this.$store.dispatch('authentication/login', {email: this.email, password: this.password, keepMeLoggedIn: this.keepMeLoggedIn});
        }
    }
}
</script>
<style>
  .hv-100 {
    height: 100vh;
  }
  .loginButton
  {
    width: 100px;
    margin: 20px auto 0 auto;
  }
</style>

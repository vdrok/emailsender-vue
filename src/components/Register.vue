<template>
    <b-container class="hv-100">
        <b-row class="justify-content-center h-100 align-items-center">
            <b-card title="Register"
                    style="width: 500px;"
                    class="text-center loginCard card-block"
            >
                <b-alert show variant="danger" v-if="errorHandler">{{errorHandler}}</b-alert>
                Already have an account? <b-link to="/login">Log in</b-link>
                <b-form @submit="onRegister" class="text-left">
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
                            id="username"
                            label="Username"
                            label-for="usernameInput"
                            :invalid-feedback="invalidUsername"
                            :valid-feedback="validFeedback"
                            :state="stateUsername"
                    >
                        <b-form-input id="usernameInput" :state="stateUsername" v-model="username" type="text"></b-form-input>
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
                    <b-button block type="submit" variant="primary" class="registerButton">Register</b-button>
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
                username: '',
                password: '',
                email: ''
            }
        },
        computed: {
            stateEmail () {
                const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(this.email).toLowerCase());
            },
            stateUsername () {
                return this.username.length >= 2
            },
            statePassword () {
                return this.password.length >= 2
            },
            invalidEmail () {
                if (this.email.length > 0) {
                    return 'Enter valid email'
                } else {
                    return 'Please enter something'
                }
            },
            invalidUsername () {
                if (this.username.length > 2) {
                    return ''
                } else if (this.username.length > 0) {
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
                return this.$store.state.registration.errorText;
            }
        },
        methods: {
            onRegister(e){
                e.preventDefault();
                this.$store.dispatch('registration/register', {email: this.email, username: this.username, password: this.password});
            }
        }
    }
</script>
<style>
    .hv-100 {
        height: 100vh;
    }
    .registerButton
    {
        width: 100px;
        margin: 20px auto 0 auto;
    }
</style>

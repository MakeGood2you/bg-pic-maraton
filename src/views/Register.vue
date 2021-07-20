<template>
  <div>
    <br><br><br>
    <div class="background">
      <br>
      <img alt="Shareve logo" class="image" src="../assets/one.png" width="160">
      <div class="ori" dir="rtl">
        <form class="q-gutter-md">
          <br>
          <h5>התחבר כמוזמן</h5>
          <div>
            <div dir="ltr" v-if="!code">
              <q-input id="fullName" v-model="details.fullName" :rules="[val => !!val || 'שדה חובה']" type="text"> שם
              </q-input>
              <q-input id="phone" v-model="phone" :rules="[val => !!val || 'שדה חובה']" mask="###-###-####" stack-label>
                טלפון
              </q-input>
              <div id="recaptcha-container">
              </div>
            </div>

            <br>
            <div v-show="code" class="verifyCode">
              <q-input id="code" v-model="password" label="הזן את קוד האימות" stack-label/>
            </div>
            <q-btn v-if="!code" class="buttonC" color="black" label="שלח קוד אימות" style="width: 92%"
                   @click="sendCodeToVerify()"/>

            <q-btn v-if="code" class="buttonC" color="black" label="התחבר" style="width: 92%"
                   @click="logWithPhone(password)"/>
          </div>
        </form>
        <br>
        <br>
      </div>
      <div style="text-align: center">
      </div>
    </div>
  </div>
</template>

<script>

import firebaseInstance from '../middleware/firebase'
import database from "../middleware/firebase/database";
import pictureAdded from "../views/pictureAdded";

const window = {
  recaptchaVerifier: undefined
}

let verify = window.recaptchaVerifier;
let signUp = [];

export default {
  components: {pictureAdded},
  name: "Register",
  data() {
    return {
      uid: this.$route.params.uid,
      eid:this.$route.params.eid,
      code: false,
      phoneAuth: false,
      password: '',
      phone: '',
      details: {
        fullName: '',
        limit: '',
      },

      accept: false,
    }
  },

  methods: {

    async sendCodeToVerify() {

      window.recaptchaVerifier = new firebaseInstance.firebase.auth.RecaptchaVerifier('recaptcha-container');
      const phoneNumber = '+972' + this.phone;
      const appVerifier = window.recaptchaVerifier;
      debugger
      firebaseInstance.firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)

          .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            debugger
            alert('קוד אימות נשלח ברגעים אלו')
            this.code = !this.code

          })
    },


    async logWithPhone(password) {

      const userIdentity = this.$route.params.uid
      const eventIdentity = this.$route.params.eid
      const guestPhone = this.phone
      const guestName = this.details.fullName
      const guestsDetails = this.details


      await database.getLimit({userIdentity, eventIdentity}).then((res) => {
        this.details.limit = res
        console.log(this.details.limit)
      })


      await database.setDetails({userIdentity, eventIdentity, guestsDetails, guestPhone})
      window.confirmationResult.confirm(password).then((invited) => {
        alert('הרישום בוצע בהצלחה')
        let user = invited.user;

        this.$router.push(`/pictureAdded/${userIdentity}/${eventIdentity}/${guestPhone}/${guestName}`);

      }).catch((error) => {
        alert('הקוד אינו תקין')
      });

    },

    invitedEnter() {
      this.turn = true
    },

    invitorEnter() {
      this.turn = false
    },

    created() {
      if (window.user) {
        this.$router.push('/pictureAdded')
      }
    }
  },
}


</script>

<style>

.ori {
  text-align: center;
  align-items: center;
  padding-left: 20%;
  padding-right: 20%;
}

.buttonC {
  margin-top: 15px;
  display: flex;
}

.buttonC:hover {
  filter: opacity(70%);
}

.image {
  display: flex;
  margin: auto;
  alignment: center;

}

.background {

  background-color: rgba(255, 255, 255, 0.49);
  margin-left: 10%;
  margin-right: 10%;
}

iframe {
  margin-right: -100px;
  padding-left: 18px;
}


</style>

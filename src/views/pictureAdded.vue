<template xmlns="http://www.w3.org/1999/html">
  <div dir="rtl" v-if="daylight === true">
    <div>
      <img alt="pic" class="picpic" src="../assets/logo1.png" width="50">
    </div>
    <br><br>
      <div dir="ltr" style="color: #000000; text-align: center;">
        <h6 style="font-size: 25px; margin-top: 10px"><b> האירוע של {{ eventDetails.organizer }} </b></h6>
      </div>
      <div class="croppa column items-center">
        <div class="btns">
          <p class="btns q-pa-sm" style="width: 200px; margin-top: -20px">כמות תמונות שנותרו לפיתוח:
            <b>{{ guestLimit }}</b></p>
        </div>
      </div>


    <cropper :params="params"></cropper>
    <q-footer class="header-card footerLa" style="background-color: rgba(255,255,255,0.51); color: black">
      <br>
      <p style="margin-top: 20px; font-size: 19px; width: 100%; margin: auto"><b>גם אתם רוצים את {{ businessInfo.BName }}?</b></p>
      <div style="margin-top: -12px">
        <p class=" comeToUs"><b class="copy comeToUs" style="color: #282576; font-size: 17px" @click="copy"> לחצו
          כאן!</b></p>
        <div style=" font-size: 17px">

          <p><b>טלפון:</b> {{ businessInfo.BPhone }} </p>
          <p style="margin-top: -15px"><b>מייל: </b>{{ businessInfo.BEmail }}</p>
        </div>
      </div>
    </q-footer>
  </div>
</template>


<script>
import firebaseDatabase from "../middleware/firebase/database";
import firebase from "firebase";
import 'firebase/storage';
import database from "../middleware/firebase/database";
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2'
import {mapActions, mapState} from 'vuex'
import Cropper from '../components/addImage/Cropper'
Vue.use(VueClipboard);
import { positive} from "../middleware/notify/index";

export default {

  data() {
    return {
     params:{
       uid: this.$route.params.uid,
       eid: this.$route.params.eid,
       phoneNumber: this.$route.params.phone,
       firstName: this.$route.params.fullName,
     },
    }
  },
  components: {
    Cropper,
  },
  computed: {
    ...mapState('app', ['confirmDialog', 'daylight', 'guestLimit', 'eventDetails', 'businessInfo']),
  },
  methods: {
    ...mapActions('app', ['uploadImageToStorage', 'isEventOpenPermission', 'getAdminDetails', 'getBusinessInfo','getLimitFromGuest']),
    ...mapActions('auth', ['setLead']),
    async init() {
      const options = this.params
      await this.getAdminDetails(options)
      await this.getLimitFromGuest(options)
      await this.isEventOpenPermission()
      await this.getBusinessInfo(options)
    },

    async copy() {
     await this.setLead(this.params)
      alert('הפרטים שלך נשלחו בהצלחה')
      // this.$q.notify(positive('התחברת בהצלחה :)'))
    },
  },

  async created() {
    await this.init()
  }
}
</script>

<style>
body {
  background-color: #d9d2cd;
}

.imgTable {
  width: 95%;
  margin: auto;
  display: flex;
  flex-direction: column;
}

.footerLa {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 22%;
  text-align: center;
  margin: auto;
  background: rgba(255, 255, 255, 0.18);
  color: #000000;
}

.copy:hover {
  filter: opacity(50%);
  color: #00006c;
}

.comeToUs {
  margin-top: 25px;
}

.picpic {
  position: absolute;
  left: 10px;
  top: 10px;
}


/*.send {*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*  margin: auto;*/
/*  width: 328.875px;*/
/*}*/

.croppa-container {
  background-color: #eae7e5;
  border: 1px solid grey;
}

.croppa-container:hover {
  opacity: 1;
  background-color: #d2c7c3;
}

.croppa {
  margin-top: -25px;
}
</style>

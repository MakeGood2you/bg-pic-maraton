<template xmlns="http://www.w3.org/1999/html">
  <div dir="rtl" v-if="daylight === true">
    <div>
      <img alt="pic" class="picpic" src="../assets/logo1.png" width="50">
    </div>
    <br><br>
    <div class="q-pa-md">
      <div dir="ltr" style="color: #000000; text-align: center;">
        <h6 style="font-size: 25px; margin-top: 10px"><b> האירוע של {{ adminName }} </b></h6>
      </div>
      <div class="croppa column items-center">
        <div class="btns">
      <p class="btns" style="width: 200px; margin-top: -20px">כמות תמונות שנותרו לפיתוח: <b>{{limitedPic}}</b></p>
        </div>
      </div>
      <!--        <q-uploader-->
      <!--            :url="makeUploadTaskWithTimestamp"-->
      <!--            multiple-->
      <!--            @finish="finished"-->
      <!--            ref="uploader"-->
      <!--            class="imgTable"-->
      <!--            :max-files="limitedPic"-->
      <!--                  :label=" 'כמות תמונות לפיתוח: ' + limitedPic"-->
      <!--            dir="rtl"-->
      <!--            dark-->
      <!--            square-->
      <!--            accept=".jpg, .png, image/*"-->
      <!--            color="black"-->
      <!--        />-->

    </div>
    <div class="croppa column items-center">

      <croppa v-model="myCroppa"
              :width="328.875"
              :height="232.5"
              :align="'center'"
              :placeholder="`בחר תמונה..`"
              :placeholder-font-size="0"
              :placeholder-color="'default'"
              :accept="'.jpg, .jpeg, .png, image/*'"
              :file-size-limit="0"
              :quality="2"
              :zoom-speed="3"
              :disabled="false"
              :disable-drag-and-drop="false"
              :disable-click-to-choose="false"
              :disable-drag-to-move="false"
              :disable-scroll-to-zoom="false"
              :disable-rotation="false"
              :prevent-white-space="false"
              :reverse-scroll-to-zoom="false"
              :show-remove-button="false"
              :remove-button-color="'red'"
              :remove-button-size="0"
              :initial-image="'path/to/initial-image.png'"
      >
      </croppa>

      <div class="row justify-between btns">
        <q-btn
            style="width: 162px;
            background-color: #505050;
            color: #fdfdfe"
            @click="myCroppa.rotate(-1)"
        >
          <q-icon name="rotate_90_degrees_ccw"/>
        </q-btn>
        <q-btn
            style="width: 162px"
            @click="myCroppa.remove()"
            color="red"
        >
          <q-icon name="delete"/>
        </q-btn>
      </div>
      <div class="send">
        <q-btn
            @click="uploadCroppedImage"
            color="green"
            label="שלח"
            style="font-size: 15px"
        >
        </q-btn>
      </div>
    </div>


    <q-footer class="header-card footerLa" style="background-color: rgba(255,255,255,0.51); color: black">
      <br>
      <p style="margin-top: 20px; font-size: 19px; width: 100%; margin: auto"><b>גם אתם רוצים את {{ BName }}?</b></p>
      <div style="margin-top: -12px">
        <p class=" comeToUs"><b class="copy comeToUs" style="color: #282576; font-size: 17px" @click="copy"> לחצו
          כאן!</b></p>
        <div style=" font-size: 17px">

          <p><b>טלפון:</b> {{ BPhone }} </p>
          <p style="margin-top: -15px"><b>מייל: </b>{{ BEmail }}</p>
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
import {mapState} from 'vuex'

Vue.use(VueClipboard);

export default {

  data() {
    return {
      uid: this.$route.params.uid,
      eid: this.$route.params.eid,
      phoneNumber: this.$route.params.phone,
      firstName: this.$route.params.fullName,
      picturs: [],
      limitedPic: '',
      adminDate: '',
      adminName: '',
      BName: '',
      BEmail: '',
      BPhone: '',
      daylight: false,
      myCroppa: {}

    }
  },
  computed:{
    ...mapState('app', ['confirmDialog']),

  },
  methods: {
    uploadCroppedImage() {
      this.myCroppa.generateBlob(
          blob => {
            var url = URL.createObjectURL(blob)
            console.log(url)
          },
          '.jpg, .jpeg, .png, image/*',
          0.8
      ); // 80% compressed jpeg file
    },


    finished() {
      this.$refs.uploader.reset()
      alert('תמונות הועלו בהצלחה')
    },

    copy() {
      firebaseDatabase.setCopyNumber({userIdentity: this.uid, phone: this.phoneNumber, leadName: this.firstName})
      alert('פרטיך נשלחו בהצלחה לצלם')
    },
    async makeUploadTaskWithTimestamp(file) {

      const storageRef = firebase.storage().ref(`/users/${this.uid}/events/${this.eid}`)
      const firstName = this.firstName
      const originalName = file[0].name
      const newFilename = `${Date.now()}.${file[0].name}`
      const metadata = {
        customMetadata: {
          originalName,
          firstName
        }
      }
      if (this.limitedPic <= 0) {
        console.log('none')
      } else {

        await storageRef.child(newFilename).put(file[0], metadata)

        this.limitedPic--

        const userIdentity = this.$route.params.uid
        const eventIdentity = this.$route.params.eid
        const phoneNumber = this.phoneNumber
        const counterImg = this.limitedPic

        await firebaseDatabase.setLimit({userIdentity, eventIdentity, phoneNumber, counterImg})

      }
    }
  },

  async created() {
    const userIdentity = this.$route.params.uid
    const eventIdentity = this.$route.params.eid
    const phoneNumber = this.phoneNumber

    const obj = await database.getAdminDetails({userIdentity, eventIdentity})
    this.adminName = obj.organizer
    this.adminDate = obj.date

    const businessDetails = await database.getBInfo({userIdentity, eventIdentity})
    this.BName = businessDetails.BName
    this.BEmail = businessDetails.BEmail
    this.BPhone = businessDetails.BPhone

    if (this.BName === null) {
      this.BName = '-'
    }
    if (this.BEmail === null) {
      this.BEmail = '-'
    }
    if (this.BPhone === null) {
      this.BPhone = '-'
    }
    console.log(this.adminDate)
    let date = new Date();
    let ye = date.toLocaleString('en', {year: 'numeric'});
    let mo = date.toLocaleString('en', {month: '2-digit'});
    let da = date.toLocaleString('en', {day: '2-digit'});
    var momentDate = `${ye}-${mo}-${da}`

    if (momentDate === this.adminDate) {
      database.getIsOpen({userIdentity, eventIdentity}).then((res) => {
        const isOpen = res.val()
        console.log(isOpen)
        if (isOpen === null || undefined) {
          this.daylight = false
          alert('הגישה למערכת חסומה')
        } else {
          if (isOpen === true) {
            this.daylight = true
          } else {
            alert('הרשאה למערכת לא תקפה')
          }
        }
      })
    } else {
      alert('הרשאה לשימוש תפתח ביום האירוע')
    }

    this.limitedPic = await firebaseDatabase.getLimitFromGuest({userIdentity, eventIdentity, phoneNumber})
    return this.limitedPic

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


.btns {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 328.875px;
}

.send {
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 328.875px;
}

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

<template>
  <div class="column items-center">
    <croppa v-model="myCroppa"
            :width="328.875"
            :height="232.5"
            :align="'center'"
            :placeholder-font-size="0"
            :accept="'.jpg, .jpeg, .png, image/*'"
            :quality="2"
            initial-size="contain"
            :zoom-speed="3"
            :disabled="false"
            :disable-click-to-choose="false"
            :disable-drag-to-move="false"
            :disable-scroll-to-zoom="false"
            :disable-rotation="false"
            :prevent-white-space="true"
            :reverse-scroll-to-zoom="false"
            :show-remove-button="false"
            :remove-button-color="'red'"
            :remove-button-size="0"
    >
            <img slot="placeholder"
                 src="https://firebasestorage.googleapis.com/v0/b/osher-project.appspot.com/o/users%2FPW93KJl7bAZuZo9lXNDrqZyWLBD3%2Fevents%2F-MeYoKhDC-5LR5UdcwjO%2F3?alt=media&token=d81808d0-4434-411b-a882-71d6a9224999"
                 class="addon">
    </croppa>

    <div class="row justify-between q-my-sm btns">
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
    <div class="column send">
      <q-btn
          @click="uploadCroppedImage"
          color="positive"
          label="שלח"
          style="font-size: 15px"
      />
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  name: "Cropper",
  props: ['params'],
  data: () => ({
    myCroppa: {},
    LocalGuestLimit: 0,
    dataURL: ''
    // uid: this.$route.params.uid,
    // eid: this.$route.params.eid,
    // phoneNumber: this.$route.params.phone,
    // firstName: this.$route.params.fullName,

  }),
  computed: mapState('app', ['guestLimit']),

  methods: {
    ...mapActions('app', ['uploadImageToStorage']),
    async uploadCroppedImage() {
      if (!this.myCroppa.hasImage()) {
        alert('no image to upload')
        return
      }
      await this.myCroppa.generateBlob(
          async (blob) => {
           await this.uploadImage(blob)
          },
          '.jpg, .png, .jpeg, image/*', 0.8); // 80% compressed jpeg file
      console.log(this.myCroppa)
      this.myCroppa.remove()
    },
    async uploadImage(file) {
      if (this.LocalGuestLimit <= 0) {
        console.log('none')
      } else {
        const options = this.createParams(file)

        this.LocalGuestLimit--

        await this.uploadImageToStorage(options)
      }
    },

    createParams(file) {
      return {
        file,
        firstName: this.params.firstName,
        uid: this.params.uid,
        eid: this.params.eid,
        phoneNumber: this.params.phoneNumber,
        limitedPicCounter: this.LocalGuestLimit
      }
    }
  },
  async created() {
    console.log(this.params)
    this.LocalGuestLimit = this.guestLimit
  }
}
</script>

<style scoped>

.btns {
  width: 328.875px;
}

.send {

  width: 328.875px;
}

.croppa {
  margin-top: -25px;
}
</style>
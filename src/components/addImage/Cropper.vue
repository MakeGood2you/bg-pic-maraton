<template>
  <div class="column items-center">
    <croppa v-model="myCroppa"
            :width='frameWidth'
            :height='frameHeight'
            :align="'center'"
            :placeholder-font-size="0"
            :placeholder-color="'black'"
            :accept="'.jpg, .jpeg, .png, image/*'"
            :quality="realQuality"
            initial-size="cover"
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
            class="column items-center"
            :show-loading="true"
            @file-choose="handleWarn"
            @draw="onDraw"

    >

      <img slot="placeholder" :src="frame" crossOrigin="anonymous" height="10px" class="sticker">
      <!--      <div class="spinner" v-if="myCroppa && myCroppa.loading"></div>-->
    </croppa>
    <Loading v-if="loading"></Loading>

    <div class="row justify-between q-my-sm btns">
      <q-btn
          style="width: 152px;
           background-color: #505050;
           color: #fdfdfe"
          @click="myCroppa.rotate(-1)"
      >
        <q-icon name="rotate_90_degrees_ccw"/>
      </q-btn>
      <q-btn
          style="width: 152px"
          @click="myCroppa.remove()"
          color="red"
      >
        <q-icon name="delete"/>
      </q-btn>
    </div>
    <div class="column send">
      <q-btn
          @click="uploadCroppedImage()"
          color="positive"
          label="שלח"
          style="font-size: 15px"
      />
    </div>
  </div>
</template>

<script>
import {mapActions, mapState, mapMutations} from 'vuex'
import Loading from '../Loading'

export default {
  name: "Cropper",
  props: ['params'],
  components: {Loading},
  data: () => ({
    myCroppa: {},
    LocalGuestLimit: 0,
    counter: 0,
    dataURL: '',
    frame: null,
    frameSize: {},
    frameWidth: '',
    frameHeight: '',
    realQuality: ''
  }),

  computed: {
    placeholder() {
      return this.myCroppa && this.myCroppa.loading ? '' : 'Choose a large file to see the loading'
    },
    initialImage() {
      return 'https://picsum.photos/900/900?' + new Date().valueOf()
    },
    ...mapState('app', ['guestLimit', 'loading']),
  },

  methods: {
    ...mapActions('app', ['uploadImageToStorage', 'isEventExist', 'isEventOpenPermissionOpen', 'getFrame', 'frameRatio']),
    ...mapMutations('app', ['setBoolean']),
    async uploadCroppedImage(type, compressionRate) {
      if (!this.myCroppa.hasImage()) {
        alert('no image to upload')
        return
      }
      const options = await this.params
      const isEventExist = await this.isEventExist(options) //if the admin delete the event
      console.log('isEventExistKobi ', isEventExist)

      const isOpenPermission = await this.isEventOpenPermissionOpen(options)// if the admin close the permission
      console.log('isOpenPermission ', isOpenPermission)


      if (isEventExist && isOpenPermission) {
        await console.log('this.myCroppa ', this.myCroppa.generateBlob)
        await this.myCroppa.generateBlob(
            async (blob) => {
              debugger
              await this.uploadImage(blob)
            },
            type, compressionRate); // 80% compressed jpeg file
        console.log(this.myCroppa)
        this.myCroppa.remove()
      } else {
        alert('האירוע נסגר - לא ניתן להעלות תמונות')
      }
    },

    async handleWarn() {
      await alert('שימו לב! תמונות שלא מהאירוע לא יפותחו')
    },
    async uploadImage(file) {
      if (!this.guestLimit) {
        console.error('no limit to upload')
        return
      }
      this.setBoolean({stateName: 'loading', bool: true})
      let options = this.createParams(file)
      await this.uploadImageToStorage(options)
      this.setBoolean({stateName: 'loading', bool: false})
      console.log('image uploaded')
    },
    async getFrameSize() {
      this.frameSize = await this.frameRatio(this.params)
      if (this.frameSize === '10x15') {
        this.frameWidth = 311.811023623
        this.frameHeight = 207.874015745
        this.realQuality = 3.6363636363
      } else {
        this.frameWidth = 311.811023623
        this.frameHeight = 233.85826812
        this.realQuality = 2.4242424242
      }
    },

    createParams(file) {
      return {
        file,
        firstName: this.params.firstName,
        uid: this.params.uid,
        eid: this.params.eid,
        phoneNumber: this.params.phoneNumber,
      }
    },
    onDraw(ctx) {
      ctx.save()
      ctx.drawImage(document.querySelector('.sticker'), 0, 0, this.frameWidth * this.realQuality, this.frameHeight * this.realQuality)
    }
  },
  async created() {
    this.LocalGuestLimit = this.guestLimit
    this.frame = await this.getFrame(this.params)
    await this.getFrameSize()
  }
}
</script>

<style scoped>

.btns {
  width: 311.811023623px;
}

.send {
  width: 311.811023623px;
}

.croppa-container {
  background-color: #F9F9F9;
}

.croppa-container:hover {
  background-color: #F9F9F9;
}
</style>

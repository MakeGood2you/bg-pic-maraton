<template>
  <div class="column items-center">
    <croppa v-model="myCroppa"
            :width="328.875"
            :height="232.5"
            :align="'center'"
            :placeholder-font-size="0"
            :placeholder-color="'default'"
            :accept="'.jpg, .jpeg, .png, image/*'"
            :quality="2"
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
    >

      <!--      <div class="spinner" v-if="myCroppa && myCroppa.loading"></div>-->

    </croppa>
    <Loading v-if="loading"></Loading>

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
    dataURL: ''
    // uid: this.$route.params.uid,
    // eid: this.$route.params.eid,
    // phoneNumber: this.$route.params.phone,
    // firstName: this.$route.params.fullName,
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
    ...mapActions('app', ['uploadImageToStorage', 'isEventExist','isEventOpenPermissionOpen']),
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
        await this.myCroppa.generateBlob(
            async (blob) => {
              await this.uploadImage(blob)
            },
            type, compressionRate); // 80% compressed jpeg file
        console.log(this.myCroppa)
        this.myCroppa.remove()
      } else {
        alert('האירוע נסגר - לא ניתן להעלות תמונות')
      }
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

    createParams(file) {
      return {
        file,
        firstName: this.params.firstName,
        uid: this.params.uid,
        eid: this.params.eid,
        phoneNumber: this.params.phoneNumber,
      }
    }
  },
  async created() {
    console.log(this.params)
    this.LocalGuestLimit = this.guestLimit
    console.log(' this.LocalGuestLimit ', this.LocalGuestLimit)
    console.log(' this.this.guestLimit ', this.guestLimit)
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

/*.croppa-container {*/
/*  background-color: lightblue;*/
/*  border: 2px solid grey;*/
/*  border-radius: 8px;*/
/*}*/

/*.croppa-container:hover {*/
/*  opacity: 1;*/
/*  background-color: #8ac9ef;*/
/*}*/
</style>

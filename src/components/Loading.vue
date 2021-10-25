<template>
  <div v-if="loading" class="q-pa-md">

  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Loading",

  computed: mapState('app', ['loading']),
  methods: {
    showLoading() {
      this.$q.loading.show({
        message: '👍 התמונה נשלחת אלי ברגעים אלו... עבודה טובה ',
        messageColor: 'black'
      })

      // // hiding in 3s
      this.timer = this.loading
    }
  },

  beforeDestroy() {
    if (this.timer !== void 0) {
      clearTimeout(this.timer)
      this.$q.loading.hide()
    }
  },
  created() {
    this.showLoading()
  },
  watch: {
    loading(val){
      console.log(val)
      if (val){
        this.showLoading()
      }else {
        this.$q.loading.hide()
      }
    }
  }

}
</script>

<style scoped>

</style>

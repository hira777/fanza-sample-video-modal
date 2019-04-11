<template>
  <div id="fanza-video-modal">
    <fanza-modal :visible.sync="visible" :item-link="itemLink" :title="title">
      <fanza-video ref="fanzaVideo" :src="videoSrc"></fanza-video>
    </fanza-modal>
  </div>
</template>

<script>
import FanzaModal from './components/FanzaModal.vue';
import FanzaVideo from './components/FanzaVideo.vue';

export default {
  components: {
    FanzaVideo,
    FanzaModal
  },
  data() {
    return {
      videoSrc: '',
      title: '',
      itemLink: '',
      visible: false
    };
  },
  computed: {
    player() {
      return this.$refs.fanzaVideo.player;
    }
  },
  watch: {
    visible(value) {
      if (!value) {
        this.player.pause();
      }
    }
  },
  methods: {
    setTitle(title) {
      this.title = title;
    },
    openVideo({ cid }) {
      this.videoSrc = this.getVideoSrc({ cid });
      this.itemLink = this.getItemLink({ cid });
      this.visible = true;
    },
    getVideoSrc({ cid }) {
      const movieId = cid.replace(/(?<=[a-z])00/, '');
      const path = movieId.substring(0, 1);
      const path2 = movieId.substring(0, 3);
      return `https://cc3001.dmm.co.jp/litevideo/freepv/${path}/${path2}/${movieId}/${movieId}_dmb_w.mp4`;
    },
    getItemLink({ cid }) {
      return `https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=${cid}/`;
    }
  }
};
</script>

import Vue from 'vue';

import FanzaModal from '@/components/FanzaModal.vue';
import FanzaVideo, {
  PLAYER_STATE,
  BIT_RATES
} from '@/components/FanzaVideo.vue';

const createFanzaSampleVideoModalVM = ({ el }) => {
  return new Vue({
    el,
    components: {
      FanzaVideo,
      FanzaModal
    },
    data() {
      return {
        videoSrc: '',
        bitRates: {},
        playerState: PLAYER_STATE.PAUSED,
        title: '',
        itemLink: '',
        visible: false
      };
    },
    watch: {
      visible(value) {
        if (!value) {
          this.playerState = PLAYER_STATE.PAUSED;
        }
      }
    },
    methods: {
      setBitRates(bitRates) {
        this.bitRates = { ...bitRates };
      },
      setTitle(title) {
        this.title = title;
      },
      setItemLink(itemLink) {
        this.itemLink = itemLink;
      },
      openVideo() {
        this.videoSrc = this.bitRates[BIT_RATES['1000']].src;
        this.visible = true;
        this.playerState = PLAYER_STATE.PLAYING;
      }
    },
    template: `<div id="fanza-video-modal">
              <fanza-modal :visible.sync="visible" :item-link="itemLink" :title="title">
                <fanza-video ref="fanzaVideo" :src="videoSrc" :bitRates="bitRates" :playerState="playerState"></fanza-video>
              </fanza-modal>
            </div>`
  });
};

export default createFanzaSampleVideoModalVM;

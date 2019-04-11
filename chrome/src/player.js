import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPlayCircle,
  faPauseCircle
} from '@fortawesome/free-regular-svg-icons';
import { faUndoAlt, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { $ } from './utils/dom';
import keyBy from './utils/keyBy';
import idsWithNoSampleMovie from './idsWithNoSampleMovie';
import { BIT_RATES } from './enums';
import FanzaModal from './components/FanzaModal.vue';
import FanzaVideo from './components/FanzaVideo.vue';

library.add(faPlayCircle, faPauseCircle, faUndoAlt, faRedoAlt);

Vue.component('font-awesome-icon', FontAwesomeIcon);

function createSampleButton() {
  const $sampleButton = document.createElement('p');
  $sampleButton.setAttribute('class', 'sample');
  $sampleButton.innerHTML =
    '<a href><span class="btn-sample"><span></span></span></a>';
  return $sampleButton;
}

function getCid({ el }) {
  const itemUrl = el
    .querySelector('.tmb')
    .querySelector('a')
    .getAttribute('href');
  return itemUrl.match(/(?<=cid=)[\w-]+/g)[0];
}

document.body.insertAdjacentHTML(
  'beforeend',
  '<div id="fanza-video-modal"></div>'
);

const vm = new Vue({
  el: '#fanza-video-modal',
  components: {
    FanzaVideo,
    FanzaModal
  },
  data() {
    return {
      videoSrc: '',
      bitRates: {},
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
    }
  },
  template: `<div id="fanza-video-modal">
              <fanza-modal :visible.sync="visible" :item-link="itemLink" :title="title">
                <fanza-video ref="fanzaVideo" :src="videoSrc" :bitRates="bitRates"></fanza-video>
              </fanza-modal>
            </div>`
});

[...$('#list').querySelectorAll('li')].forEach(itemEl => {
  const cid = getCid({ el: itemEl });

  if (idsWithNoSampleMovie.includes(cid)) return;

  const $sampleButton = createSampleButton();
  $sampleButton.addEventListener('click', async e => {
    e.preventDefault();

    const sampleMovieUrl = `https://www.dmm.co.jp/service/digitalapi/-/html5_player/=/cid=${cid}/mtype=CARdWwNE/service=digital/floor=videoa/mode=/`;

    try {
      const response = await fetch(sampleMovieUrl);
      const html = await response.text();
      const movieInfo = JSON.parse(html.match(/(?<=var params.+){.+}/));

      vm.setTitle(movieInfo.title);
      vm.setItemLink(
        `https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=${cid}/`
      );
      vm.setBitRates(keyBy(movieInfo.bitrates, 'bitrate'));
      vm.openVideo();
    } catch (err) {
      throw err;
    }
  });
  itemEl.querySelector('div').appendChild($sampleButton);
});

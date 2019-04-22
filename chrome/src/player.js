import Vue from 'vue';

import { $ } from '@/utils/dom';
import keyBy from '@/utils/keyBy';
import idsWithNoSampleMovie from '@/idsWithNoSampleMovie';
import FanzaModal from '@/components/FanzaModal.vue';
import FanzaVideo, {
  PLAYER_STATE,
  BIT_RATES
} from '@/components/FanzaVideo.vue';

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
      this.playerState = PLAYER_STATE.PLAYING;
      this.visible = true;
    }
  },
  template: `<div id="fanza-video-modal">
              <fanza-modal :visible.sync="visible" :item-link="itemLink" :title="title">
                <fanza-video ref="fanzaVideo" :src="videoSrc" :bitRates="bitRates" :playerState="playerState"></fanza-video>
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

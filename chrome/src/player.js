import { $ } from '@/utils/dom';
import keyBy from '@/utils/keyBy';
import createSampleButton from '@/utils/createSampleButton';
import getCid from '@/utils/getCid';
import createFanzaSampleVideoModalVM from '@/utils/createFanzaSampleVideoModalVM';
import idsWithNoSampleMovie from '@/idsWithNoSampleMovie';

const id = 'fanza-sample-video-modal';
document.body.insertAdjacentHTML('beforeend', `<div id="${id}"></div>`);
const vm = createFanzaSampleVideoModalVM({ el: `#${id}` });

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

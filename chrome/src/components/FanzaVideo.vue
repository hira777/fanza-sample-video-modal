<template>
  <div v-if="src !== ''" class="fanza-video">
    <video
      ref="video"
      autoplay
      :src="src"
      :currentTime.prop="timeProp"
      @loadstart="hanleLoadStart"
      @canplaythrough="handleCanplayThrough"
      @play="handlePlay"
      @playing="handlePlaying"
      @pause="handlePause"
      @timeupdate="handleTimeUpdate"
    ></video>
    <vue-slider
      v-model="progress"
      :duration="0"
      :height="12"
      :dot-size="15"
      :contained="true"
      tooltip="none"
      :process-style="{ backgroundColor: '#00a6fe' }"
      :rail-style="{ backgroundColor: '#0e0e0e' }"
      style="margin: 0 auto;"
      @change="handleSliderChange"
    ></vue-slider>
    <div class="fanza-video-time">
      {{ timeDisplay }}
    </div>
    <div class="fanza-video-control">
      <div role="button" class="fanza-video-button" @click="backward10Seconds">
        <img src="@/assets/images/forward_10.png" />
      </div>
      <div
        v-show="!isPlaying"
        role="button"
        class="fanza-video-button fanza-video-button--play"
        @click="play"
      >
        <img src="@/assets/images/play_circle.png" />
      </div>
      <div
        v-show="isPlaying"
        role="button"
        class="fanza-video-button fanza-video-button--pause"
        @click="pause"
      >
        <img src="@/assets/images/pause_circle.png" />
      </div>
      <div role="button" class="fanza-video-button" @click="forward10Seconds">
        <img src="@/assets/images/replay_10.png" />
      </div>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

export const PLAYER_STATE = {
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED'
};

export const BIT_RATES = {
  '300': '300',
  '1000': '1000',
  '1500': '1500'
};

export default {
  name: 'FanzaVideo',
  components: {
    VueSlider
  },
  props: {
    src: {
      type: String,
      default: ''
    },
    bitRates: {
      type: Object,
      default: () => {}
    },
    playerState: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      player: null,
      timeProp: 0,
      currentTime: 0,
      duration: 0,
      progress: 0,
      isLoading: false,
      isPlaying: false
    };
  },
  computed: {
    timeDisplay() {
      return `${this.to2DigitTime(this.currentTime / 60)}:${this.to2DigitTime(
        this.currentTime % 60
      )} / ${this.to2DigitTime(this.duration / 60)}:${this.to2DigitTime(
        this.duration % 60
      )}`;
    },
    progressPercentage() {
      return Math.floor((this.currentTime / this.duration) * 100);
    }
  },
  watch: {
    progressPercentage(v) {
      if (this.progress === v) return;
      this.progress = v;
    },
    playerState(v) {
      if (v === PLAYER_STATE.PLAYING && !this.isPlaying) this.play();
      if (v === PLAYER_STATE.PAUSED && this.isPlaying) this.pause();
    }
  },
  mounted() {
    if (!this.player) {
      this.initialize();
    }
  },
  methods: {
    to2DigitTime(time) {
      return ('00' + Math.floor(time)).slice(-2);
    },
    initialize() {
      this.player = this;
    },
    play() {
      if (this.isPlaying || !this.$refs.video) return;
      this.$refs.video.play();
      this.isPlaying = true;
    },
    pause() {
      if (!this.isPlaying) return;
      this.$refs.video.pause();
      this.isPlaying = false;
    },
    forward10Seconds() {
      const nextTime = this.currentTime + 10;
      this.timeProp = nextTime < this.duration ? nextTime : this.duration;
    },
    backward10Seconds() {
      const nextTime = this.currentTime - 10;
      this.timeProp = nextTime > 0 ? nextTime : 0;
    },
    handlePlay() {
      this.isPlaying = true;
    },
    handlePlaying() {
      this.isPlaying = true;
    },
    handlePause() {
      this.isPlaying = false;
    },
    handleTimeUpdate() {
      if (this.isLoading || !this.$refs.video) return;
      this.currentTime = Math.floor(this.$refs.video.currentTime);
    },
    hanleLoadStart() {
      this.isLoading = true;
    },
    handleCanplayThrough() {
      this.isLoading = false;
      this.duration = Math.floor(this.$refs.video.duration);
    },
    handleSliderChange() {
      const timeAfterChange = Math.floor(
        this.duration * (this.progress * 0.01)
      );
      if (this.timeProp !== timeAfterChange) {
        this.timeProp = timeAfterChange;
      }
    }
  }
};
</script>

<style lang="scss">
.fanza-video {
  color: #fff;

  video {
    margin: 0;
    padding: 0;
    width: 560px;
    height: auto;
  }

  .fanza-video-control {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    position: relative;
    color: #fff;
  }

  .fanza-video-button {
    width: 48px;
    opacity: 0.8;
    cursor: pointer;

    &.fanza-video-button--play,
    &.fanza-video-button--pause {
      margin: 0 10px;
    }

    &:hover {
      opacity: 1;
    }

    img {
      width: 100%;
    }
  }

  .fanza-video-time {
    text-align: center;
  }
}
</style>

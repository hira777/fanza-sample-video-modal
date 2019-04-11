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
      @pause="handlePause"
      @timeupdate="handleTimeUpdate"
    ></video>
    <vue-slider
      v-model="progress"
      :duration="0"
      tooltip="none"
      style="margin: 0 auto;"
      @change="handleSliderChange"
    ></vue-slider>
    <div class="fanza-video-time">
      {{ timeDisplay }}
    </div>
    <div class="fanza-video-control">
      <span class="fanza-video-second--left">10</span>
      <font-awesome-icon
        :icon="['fas', 'undo-alt']"
        size="2x"
        class="fanza-video-button "
        @click="backward10Seconds"
      />
      <font-awesome-icon
        v-show="!isPlaying"
        :icon="['far', 'play-circle']"
        size="3x"
        class="fanza-video-button fanza-video-button--play"
        @click="play"
      />
      <font-awesome-icon
        v-show="isPlaying"
        :icon="['far', 'pause-circle']"
        size="3x"
        class="fanza-video-button fanza-video-button--pause"
        @click="pause"
      />
      <font-awesome-icon
        :icon="['fas', 'redo-alt']"
        size="2x"
        class="fanza-video-button"
        @click="forward10Seconds"
      />
      <span class="fanza-video-second--right">10</span>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
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
      if (this.isPlaying) return;
      this.$refs.video.play();
    },
    pause() {
      if (!this.isPlaying) return;
      this.$refs.video.pause();
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
    handlePause() {
      this.isPlaying = false;
    },
    handleTimeUpdate() {
      if (this.isLoading || typeof this.$refs.video === 'undefined') return;
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

<style>
.fanza-video {
  color: #fff;
}
.fanza-video video {
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

.fanza-video-second--left {
  position: absolute;
  top: 11px;
  left: 232px;
  font-size: 10px;
  pointer-events: none;
}

.fanza-video-second--right {
  position: absolute;
  top: 11px;
  right: 233px;
  font-size: 10px;
  pointer-events: none;
}

.fanza-video-button {
  color: #fff;
  opacity: 0.7;
  cursor: pointer;
}

.fanza-video-button.fanza-video-button--play,
.fanza-video-button.fanza-video-button--pause {
  margin: 0 10px;
}

.fanza-video-button:hover {
  opacity: 1;
}

.fanza-video-time {
  text-align: center;
}
</style>

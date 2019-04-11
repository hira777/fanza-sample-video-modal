<template>
  <transition name="fanza-modal-fade">
    <div v-show="visible" class="fanza-modal-backdrop" @click="close">
      <div class="fanza-modal" role="dialog" @click.stop>
        <section class="fanza-modal-body">
          <slot></slot>
          <a class="fanza-modal-item-link" :href="itemLink">{{ title }}</a>
        </section>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'FanzaModal',
  props: {
    visible: {
      type: Boolean
    },
    itemLink: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    }
  }
};
</script>

<style>
.fanza-modal-fade-enter,
.fanza-modal-fade-leave-active {
  opacity: 0;
}

.fanza-modal-fade-enter-active,
.fanza-modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.fanza-modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.fanza-modal {
  display: flex;
  flex-direction: column;
  width: 600px;
  overflow-x: auto;
  background: rgba(0, 0, 0, 1);
}

.fanza-modal-body {
  position: relative;
  padding: 30px 20px;
}

.fanza-modal-item-link {
  display: block;
  margin-top: 18px;
  color: #fff !important;
  font-size: 20px !important;
  text-decoration: underline !important;
  transition: color 0.07s ease-in-out !important;
}

.fanza-modal-item-link:hover {
  color: #bbb !important;
  text-decoration: none;
}
</style>

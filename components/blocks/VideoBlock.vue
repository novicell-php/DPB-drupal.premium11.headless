<script setup lang="ts">
const props = defineProps({
  blockData: {
    type: Object,
    required: true,
  },
});

const seeVideo = ref(false);
const triggerPulse = ref(false);

const showVideo = () => {
  seeVideo.value = true;
};

const handleWrapperHover = () => {
  triggerPulse.value = false;
  nextTick(() => {
    triggerPulse.value = true;
  });
};
</script>

<template>
  <ClientOnly>
    <div class="video">
      <template v-if="props.blockData?.field_video_media !== null">
        <div
          class="video__wrapper"
          tabindex="0"
          role="button"
          aria-label="Play video"
          @click="showVideo"
          @keydown.enter.prevent="showVideo"
          @keydown.space.prevent="showVideo"
          @mouseenter="handleWrapperHover"
        >
          <img
            v-show="!seeVideo"
            class="video__thumbnail"
            :src="
              blockData?.field_video_media?.field_media_oembed_video
                ?.thumbnail || blockData?.field_media_oembed_video?.thumbnail
            "
            :alt="
              blockData?.field_video_media?.field_media_oembed_video?.title ||
              blockData?.field_media_oembed_video?.title
            "
            @click="showVideo"
          />
          <NuxtIcon
            v-show="!seeVideo"
            class="video__play-icon"
            :class="{ 'video__play-icon--pulse': triggerPulse }"
            name="play"
            @click="showVideo"
            @animationend="triggerPulse = false"
          />
          <div
            v-show="!seeVideo"
            class="video__content"
            :class="`video__content--${blockData?.field_video_text_color}`"
          >
            <h2
              v-show="blockData?.field_video_headline !== null"
              class="video__title"
              role="heading"
              aria-level="3"
            >
              {{ blockData?.field_video_headline }}
            </h2>
            <p
              v-show="blockData?.field_video_subline !== null"
              class="video__subtext"
            >
              {{ blockData?.field_video_subline }}
            </p>
          </div>
          <Transition name="fade-in">
            <BaseVideo
              v-if="seeVideo"
              :video="blockData?.field_video_media || blockData"
              :autoplay="true"
            />
          </Transition>
        </div>
        <div
          v-if="
            blockData.field_video_media?.field_copyright ||
            blockData?.field_copyright
          "
          class="video__copyright-text"
        >
          (Video:
          {{
            blockData.field_video_media?.field_copyright ||
            blockData?.field_copyright
          }})
        </div>
      </template>
    </div>
  </ClientOnly>
</template>

<style lang="postcss" scoped>
.video {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;

  &__wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
    overflow: hidden;
  }

  &__thumbnail {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    transition:
      transform 0.8s cubic-bezier(0.4, 0, 0.2, 1),
      filter 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__wrapper:hover .video__thumbnail {
    transform: scale(1.05);
    filter: brightness(0.85);
  }

  &:focus-within .video__thumbnail {
    transform: scale(1.05);
    filter: brightness(0.85);
  }

  &__play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 84px;
    height: 84px;
    color: var(--color-white);
    font-size: 32px;
    border: 3px solid var(--color-white);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    transform: translate(-50%, -50%);
    cursor: pointer;
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;

    :deep(svg) {
      margin: 0;
    }
  }

  &__play-icon--pulse {
    animation: pulse-once 0.4s ease;
    animation-delay: 0.3s;
  }

  &__play-icon:hover {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.9;
    filter: brightness(0.85);
  }

  &__content {
    position: absolute;
    right: 30px;
    bottom: 15px;
    z-index: 1;

    &--light {
      color: var(--color-white);
    }

    &--dark {
      color: var(--color-black);
    }
  }

  &__subtext {
    font-size: 18px;
    margin-bottom: 0;
  }

  &__copyright-text {
    margin-top: 1rem;
    color: var(--color-gray-62);
    font-size: 14px;
  }
}

@keyframes pulse-once {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.9;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}
</style>

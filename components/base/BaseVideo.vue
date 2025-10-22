<script setup>
const props = defineProps({
  video: {
    type: Object,
    required: true,
  },
  isBackground: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const isPlaying = ref(true);
const videoContainerRef = ref(null);
const iframeRef = ref(null);

const iframeHtml = computed(() => {
  if (!props.video?.field_media_oembed_video?.html) return '';

  let html = props.video.field_media_oembed_video.html;

  if (props.isBackground) {
    // Add background video parameters
    html = html.replace(/src="([^"]+)"/, (match, url) => {
      let newUrl = url;
      const separator = url.includes('?') ? '&' : '?';
      const params = [
        'autoplay=1',
        'mute=1',
        'controls=0',
        'loop=1',
        'playsinline=1',
        'disablekb=1',
        'modestbranding=1',
        'rel=0',
        'showinfo=0',
        'enablejsapi=1',
        'autohide=1',
        'iv_load_policy=3',
        'widget_referrer=0',
      ].join('&');

      let playlistParam = '';
      // Check if the URL is for YouTube
      if (/youtube\.com|youtu\.be/.test(url)) {
        // Extract the video ID
        let videoId = null;
        // youtube.com/embed/VIDEOID
        const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
        if (embedMatch) {
          videoId = embedMatch[1];
        } else {
          // youtu.be/VIDEOID
          const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
          if (shortMatch) {
            videoId = shortMatch[1];
          }
        }
        if (videoId) {
          playlistParam = `&playlist=${videoId}`;
        }
      }
      return `src="${url}${separator}${params}${playlistParam}"`;
    });

    // Add allow attribute for autoplay
    if (!html.includes('allow=')) {
      html = html.replace('<iframe', '<iframe allow="autoplay; muted"');
    }

    html = html.replace('<iframe', '<iframe style="pointer-events: none;"');
  }

  return html;
});

const togglePlayPause = () => {
  const iframe = videoContainerRef.value?.querySelector('iframe');
  if (!iframe) return;

  const command = isPlaying.value ? 'pauseVideo' : 'playVideo';
  iframe.contentWindow.postMessage(
    JSON.stringify({
      event: 'command',
      func: command,
    }),
    '*',
  );

  isPlaying.value = !isPlaying.value;
};

watch(
  () => iframeHtml.value,
  () => {
    if (videoContainerRef.value) {
      iframeRef.value = videoContainerRef.value.querySelector('iframe');
    }
  },
  { flush: 'post' },
);

onMounted(() => {
  if (videoContainerRef.value) {
    iframeRef.value = videoContainerRef.value.querySelector('iframe');
  }
});
</script>

<template>
  <div class="video-base" :class="{ 'video-base--background': isBackground }">
    <div
      v-if="props.video.bundle == 'remote_video'"
      ref="videoContainerRef"
      class="video-base__iframe"
      :aria-hidden="isBackground ? 'true' : undefined"
      v-html="iframeHtml"
    ></div>
    <div v-else>{{ props.video.bundle }} source not implemented</div>

    <button
      v-if="isBackground"
      @click="togglePlayPause"
      class="video-control"
      :aria-label="
        isPlaying ? 'Pause background video' : 'Play background video'
      "
      type="button"
    >
      <span class="video-control__icon" aria-hidden="true">
        {{ isPlaying ? '⏸' : '▶' }}
      </span>
      <span class="video-control__text">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </span>
    </button>
  </div>
</template>

<style lang="postcss" scoped>
.video-base {
  position: relative;

  &__iframe {
    position: relative;
    padding-top: 56.25%;
    overflow: hidden;

    :deep(iframe) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }

  &--background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 420px;

    @media (min-width: 640px) {
      height: 100%;
    }

    .video-base__iframe {
      width: 100%;
      height: 100%;
      padding-top: 0;

      :deep(iframe) {
        width: 100vw;
        height: 100vh;
        min-width: 100%;
        min-height: 100%;
        object-fit: cover;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(1.05);

        /* Ensure video covers the area */
        @media (min-aspect-ratio: 16/9) {
          height: 56.25vw;
        }
        @media (max-aspect-ratio: 16/9) {
          width: 177.78vh;
        }
      }
    }
  }
}

.video-control {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 12px 20px;

  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  color: white;

  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.85);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }

  &:focus {
    outline: 3px solid #4a9eff;
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.98);
  }

  &__icon {
    font-size: 16px;
    line-height: 1;
  }

  &__text {
    @media (max-width: 480px) {
      display: none;
    }
  }
}

/* Respect user's motion preferences - WCAG 2.3.3 */
@media (prefers-reduced-motion: reduce) {
  .video-base--background {
    .video-base__iframe {
      :deep(iframe) {
        display: none;
      }
    }
  }

  .video-control {
    display: none;
  }
}
</style>

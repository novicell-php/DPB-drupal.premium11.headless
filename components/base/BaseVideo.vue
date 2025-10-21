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

const iframeHtml = computed(() => {
  if (!props.video?.field_media_oembed_video?.html) return '';

  let html = props.video.field_media_oembed_video.html;

  if (props.isBackground) {
    // Add background video parameters
    html = html.replace(/src="([^"]+)"/, (match, url) => {
      let newUrl = url;
      const separator = url.includes('?') ? '&' : '?';
      // YouTube parameters
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
      ].join('&');

      // Ensure continuous looping for YouTube by adding playlist param
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

    // Add pointer-events: none style to iframe
    html = html.replace('<iframe', '<iframe style="pointer-events: none;"');
  }

  return html;
});
</script>

<template>
  <div class="video-base" :class="{ 'video-base--background': isBackground }">
    <div
      v-if="props.video.bundle == 'remote_video'"
      class="video-base__iframe"
      v-html="iframeHtml"
    ></div>
    <div v-else>{{ props.video.bundle }} not implemented</div>
  </div>
</template>

<style lang="postcss" scoped>
.video-base {
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
    height: 100%;

    .video-base__iframe {
      padding-top: 0;
      width: 100%;
      height: 100%;

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
</style>

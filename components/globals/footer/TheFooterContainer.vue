<script setup>
const props = defineProps({
  footerMenuData: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <FooterItem
    v-if="footerMenuData"
    v-for="(footerItem, index) in footerMenuData"
    :key="index"
    :node="footerItem"
  />
</template>

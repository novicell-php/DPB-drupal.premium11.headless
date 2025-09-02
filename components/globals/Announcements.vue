<script setup>
const props = defineProps({
  announcements: {
    type: Array,
  },
});

const dismissed = ref([]);
const isReady = ref(false);

onMounted(() => {
  dismissed.value = JSON.parse(
    sessionStorage.getItem('dismissedAnnouncements') || '[]',
  );
  isReady.value = true;
});

const normalizedAnnouncements = computed(() => {
  const arr = props.announcements || [];
  return arr.map((a, i) => {
    const item = a || {};
    const id = item.id ?? item.label ?? i;
    return { ...item, dismissId: String(id) };
  });
});

const visibleAnnouncements = computed(() =>
  normalizedAnnouncements.value.filter(
    (a) => !dismissed.value.includes(a.dismissId),
  ),
);

const dismiss = (id) => {
  const key = String(id);
  if (!dismissed.value.includes(key)) dismissed.value.push(key);
};

watch(
  dismissed,
  (newVal) => {
    if (process.client) {
      sessionStorage.setItem('dismissedAnnouncements', JSON.stringify(newVal));
    }
  },
  { deep: true },
);
</script>

<template>
  <div v-if="isReady">
    <transition-group name="announcement-slide" tag="div">
      <div
        class="announcements"
        v-for="announcement in visibleAnnouncements"
        :key="announcement.dismissId"
      >
        <div class="container announcements__container">
          <div class="row">
            <div class="announcements__content">
              <BaseRte :content="announcement.body" />
              <button
                v-if="announcement.field_dismissable"
                class="announcements__close"
                @click="dismiss(announcement.dismissId)"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style lang="postcss" scoped>
.announcements {
  border-bottom: 1px solid #111827;
  text-align: center;
  background-color: #f3f4f6;
  color: #111827;
  font-weight: 500;

  &__content {
    position: relative;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    :deep(p:last-child) {
      margin-bottom: 0;
    }
  }

  &__close {
    color: #111827;
    position: absolute;
    top: 0px;
    right: 15px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
}
</style>

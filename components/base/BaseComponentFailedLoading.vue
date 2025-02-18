<template>
  <div class="base-component-failed-loading">
    <div class="base-component-failed-loading__inner">Failed to Load</div>
  </div>
</template>

<style lang="postcss" scoped>
.base-component-failed-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #721c24;
}

.base-component-failed-loading__inner {
  font-size: 14px @(--sm) 16px;
  font-weight: bold;
}
</style>

<template>
  <div class="base-component-loading">
    <div class="base-component-loading__inner">Loading...</div>
  </div>
</template>

<style lang="postcss" scoped>
.base-component-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #00796b;
  border-radius: 4px;
}

.base-component-loading__inner {
  font-size: 16px;
  font-weight: bold;
  animation: loadingAnimation 1s infinite;
}

@keyframes loadingAnimation {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
</style>

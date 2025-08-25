<template>
  <div class="loading">
    <div class="loading__inner">
      <span>L</span>
      <span>o</span>
      <span>a</span>
      <span>d</span>
      <span>i</span>
      <span>n</span>
      <span>g</span>
      <span>.</span>
      <span>.</span>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.loading {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 40px 0;
  letter-spacing: 1px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
  color: var(--theme-text-color);
  font-size: 17px;
  text-transform: uppercase;
}

.loading__inner span {
  display: inline-block;
  animation: bounce 1.6s infinite;
}

.loading__inner span:nth-child(1) {
  animation-delay: 0s;
}
.loading__inner span:nth-child(2) {
  animation-delay: 0.1s;
}
.loading__inner span:nth-child(3) {
  animation-delay: 0.2s;
}
.loading__inner span:nth-child(4) {
  animation-delay: 0.3s;
}
.loading__inner span:nth-child(5) {
  animation-delay: 0.4s;
}
.loading__inner span:nth-child(6) {
  animation-delay: 0.5s;
}
.loading__inner span:nth-child(7) {
  animation-delay: 0.6s;
}
.loading__inner span:nth-child(8) {
  animation-delay: 0.7s;
}
.loading__inner span:nth-child(9) {
  animation-delay: 0.8s;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>

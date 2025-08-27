<script setup>
import { useHeaderDataStore } from '~/stores/headerData';
const headerDataStore = useHeaderDataStore();
</script>

<template>
  <navigation class="header-parent">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <TheHeader
            v-if="headerDataStore.headerData"
            :data="headerDataStore.headerData"
          />
        </div>
      </div>
    </div>
  </navigation>
</template>

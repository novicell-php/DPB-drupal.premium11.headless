<script setup lang="ts">
import { useHeaderDataStore } from '~/stores/headerData';
const headerDataStore = useHeaderDataStore();

if (headerDataStore.headerData === null) {
  headerDataStore.getHeaderData();
}
</script>

<template>
  <div class="header-parent" v-if="headerDataStore.headerData">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <TheHeader :data="headerDataStore.headerData" />
        </div>
      </div>
    </div>
  </div>
</template>

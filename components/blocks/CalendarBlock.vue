<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

const props = defineProps({
  blockData: Object,
});

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  initialView:
    props.blockData?.settings?.options?.initialView || 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
  },
  eventSources: props.blockData?.settings?.options?.eventSources || [],
};
</script>

<template>
  <div class="calendar">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<style lang="postcss" scoped>
.calendar {
  &:deep(.fc) {
    color: var(--theme-text-color);
  }

  &:deep(.fc-toolbar) {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  &:deep(.fc-button) {
    text-transform: capitalize;
    background: transparent;
    border: none;
    color: var(--theme-text-color);
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    transition: background 0.2s ease;

    &:hover {
      color: var(--theme-text-color);
      background: color-mix(in srgb, var(--theme-background-color), black 10%);
    }
  }

  &:deep(
      .fc .fc-button-primary:not(:disabled).fc-button-active,
      .fc .fc-button-primary:not(:disabled):active
    ) {
    background-color: var(--theme-text-color);
    border-color: transparent;
    color: var(--theme-background-color);
  }

  &:deep(.fc-daygrid-event) {
    background-color: var(--theme-text-color);
    color: var(--theme-background-color);
    border-radius: 4px;
    padding: 2px 4px;
    font-size: 14px;
  }

  &:deep(.fc-day-today) {
    background: color-mix(
      in srgb,
      var(--theme-background-color),
      transparent 90%
    );
  }

  &:deep(.fc-daygrid-day),
  &:deep(.fc-timegrid-slot) {
    border: 1px solid var (--theme-text-color) !important;
  }

  &:deep(.fc-theme-standard td),
  &:deep(.fc-theme-standard th),
  &:deep(.fc-theme-standard .fc-scrollgrid),
  &:deep(.fc-theme-standard .fc-scrollgrid-section),
  &:deep(.fc-list) {
    border-color: var(--theme-text-color);
  }

  &:deep(.fc-theme-standard .fc-scrollgrid) {
    background: transparent;
  }
}
</style>

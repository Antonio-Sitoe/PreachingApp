// Reexport the native module. On web, it will be resolved to ScheduleNotifieModule.web.ts
// and on native platforms to ScheduleNotifieModule.ts
export { default } from './src/ScheduleNotifieModule';
export * from './src/ScheduleNotifie.types';

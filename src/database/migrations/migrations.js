// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_init.sql';
import m0001 from './0001_usage_counters.sql';
import m0002 from './0002_students_v1.sql';
import m0003 from './0003_blushing_madelyne_pryor.sql';
import m0004 from './0004_students_journey.sql';
import m0005 from './0005_hours.sql';
import m0006 from './0006_visits.sql';
import m0007 from './0007_lesson_progress.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005,
m0006,
m0007
    }
  }
  
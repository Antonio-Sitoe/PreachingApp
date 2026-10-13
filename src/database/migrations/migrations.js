import journal from './meta/_journal.json';
import m0000 from './0000_funny_speed.sql';
import m0001 from './0001_tags.sql';
import m0002 from './0002_seed_tags.sql';
import m0003 from './0003_drop_note_tag.sql';
import m0004 from './0004_remove_devocional_tag.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004
    }
  }
  
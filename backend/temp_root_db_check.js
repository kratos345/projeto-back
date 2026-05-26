const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../database.sqlite', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('DB ERR', err);
    process.exit(1);
  }
  db.all('SELECT id, title, status, sellerId FROM Properties', [], (e, res) => {
    if (e) {
      console.error('QUERY ERR', e);
      process.exit(1);
    }
    console.log('ROOT_DB_COUNT', res.length);
    console.log(JSON.stringify(res, null, 2));
    db.close();
  });
});

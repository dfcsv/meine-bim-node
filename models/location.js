const sqlite3 = require("sqlite3").verbose();
const file = "./DB/database.sqlite";


let locationModel = {};

// insert current location in table
locationModel.postLocation = (lat, long, time, agent) => {
  lat = lat.toString();
  long = long.toString();
  time = time.toString();
  agent = JSON.stringify(agent);

  let db = new sqlite3.Database(file, err => console.log(err));
  db.serialize(() => {
    db.run("INSERT INTO location VALUES (?, ?, ?, ?)", [lat, long, time, agent]);
    db.all("SELECT * FROM location", (err, rows) => { if(rows) { console.log(rows)} });
    db.close();
  });
}

// show location table
locationModel.getLocation = () => {
  let data = new Promise((resolve, reject) => {
    let db = new sqlite3.Database(file, err => console.log(err));
    db.serialize(() => {
      db.all("SELECT * FROM location", (err, rows) => { 
        if(rows) { 
          resolve(rows);
        } else {
          resolve({});
        }
      });
      db.close();
    });
  });
  return data
}


module.exports = locationModel;
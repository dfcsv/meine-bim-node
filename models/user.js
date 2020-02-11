const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();
const file = "./DB/database.sqlite";

let userModel = {};

userModel.findOneUser = (email, password) => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(file, err => console.log(err));
    let user = {
      email: email,
      isPasswordTrue: false
    };

    db.serialize(() => {
      db.get("select * from user where email = ?", email, (err, row) => {      
        if (row) {
          let isPasswordTrue = bcrypt.compareSync(password, row.hash);
          user.dbHash = row.hash;
          user.isPasswordTrue = (user.email === row.email) ? isPasswordTrue : false
        }
        db.close();
        resolve(user);
      });
    });
  })
}

module.exports = userModel;
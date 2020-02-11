// Bcrypt Script
// $ node DB/bcrypt test@gmail.com 1234
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const args = process.argv.slice(2);
let user = args[0];
let pw = args[1];

bcrypt.hash(pw, saltRounds, (err, hash) => {
  console.log(`user: ${user}, password: ${pw}, hash: ${hash}`);
})


const response = await window.db.invoke('getInfo', '');
const response = await window.db.invoke('setDBLogin', {
  user: user,
  password: password,
  database: database,
  system: system,
});
const response = await window.db.invoke('setLogin', {
  email: email,
  password: password,
});

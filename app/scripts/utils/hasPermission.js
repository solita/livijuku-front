module.exports = function(user, permission) {
  if(!user) {
    return false;
  }
  return user.privileges.indexOf(permission) > -1;
}

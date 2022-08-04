class UserDto {
  id;
  phone;
  fullname;
  username;
  avatar;
  xp;
  interest;
  location;
  skill;
  activated;
  createdAt;
  followers;
  following;
  rooms;

  constructor(user) {
    this.id = user._id;
    this.phone = user.phone;
    this.email = user.email;
    this.fullname = user.fullname;
    this.username = user.username;
    this.location = user.location;
    this.interest = user.interest;
    this.skill = user.skill;
    this.avatar = user.avatar;
    this.xp = user.xp;
    this.activated = user.activated;
    this.createdAt = user.createdAt;
    this.following = user.following;
    this.followers = user.followers;
    this.rooms = user.rooms;
  }
}

module.exports = UserDto;

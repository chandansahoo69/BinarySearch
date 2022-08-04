class RoomDto {
  id;
  topic;
  roomType;
  speakers;
  difficultyLevel;
  questions;
  ownerId;
  createdAt;

  constructor(room) {
    this.id = room._id;
    this.topic = room.topic;
    this.roomType = room.roomType;
    this.speakers = room.speakers;
    this.questions = room.questions;
    this.ownerId = room.ownerId;
    this.difficultyLevel = room.difficultyLevel;
    this.createdAt = room.createdAt;
  }
}

module.exports = RoomDto;

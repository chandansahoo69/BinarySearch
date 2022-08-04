const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    phone: { type: String, required: false },
    email: { type: String, required: false },
    fullname: { type: String },
    password: { type: String },
    skill: { type: String },
    interest: { type: String },
    username: { type: String },
    location: { type: String },
    xp: { type: Number, default: 0, required: false },
    avatar: {
      type: String,
      required: false,
      get: (avatar) => {
        if (avatar) return `${process.env.BASE_URL}${avatar}`; //getter used to set some value
        return avatar;
      },
    },
    followers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: false,
    },
    following: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: false,
    },
    rooms: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Room",
        },
      ],
      required: false,
    },
    activated: { type: Boolean, dafault: false },
  },
  {
    timestamps: true,
    toJSON: { getters: true }, //set the allow getters to make changes
  }
);

// Hash the password
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

// For comparing password
userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error(`Password is missing, can't compare`);
  try {
    const data = bcrypt.compare(password, this.password);
    return data;
  } catch (error) {
    console.log("compare password", error);
  }
};

module.exports = mongoose.model("User", userSchema, "users");

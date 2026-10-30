import { model, Model, Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    maxlength: 20,
    minlenght: 3,
  },
  email: {
    type: String,
    unique: true,
    match: /.+\@.+\..+/,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profile: {
    first_name: {
      type: String,
      minlength: 2,
      maxlength: 50,
    },
    last_name: {
      type: String,
      minlenght: 2,
      maxlength: 50,
    },
    birth_date: {
      type: Date,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
  },
  deletedAt:{
    type: Date,
    default: null
  }
},{
  timestamps: true,
  toJSON: {virtuals: true},
  toObject: {virtuals: true },
  versionKey: false
});

userSchema.virtual("Events",  {
  ref: "Event",
  localField: "_id",
  foreignField: "organizer",
})

export const userModel = model("User", userSchema);
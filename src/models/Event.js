import { model, Model, Schema, Types } from "mongoose";

const eventSchema = new Schema({
  title: {
    type: String,
    minlength: 3,
    maxlength: 150,
    unique: true,
  },
  description: {
    type: String,
    minlength: 20,
  },
  start_Date: {
    type: Date,
    required: true,
  },
  end_Date: {
    type: Date,
    required: true,
  },
  capacity: {
    type: Number,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: "no es un número entero.",
    },
  },
  price: {
    type: Number,
    min: 0,
    default: 0,
  },
  status: {
    type: String,
    enum: ["scheduled", "cancelled", "finished"],
    default: "scheduled",
  },
  location: {
    venue: {
      type: String,
      minlength: 3,
      maxlength: 100,
    },
    address: {
      type: String,
      minlength: 5,
      maxlength: 150,
    },
    city: {
      type: String,
      minlength: 2,
      maxlength: 50,
    }
  },
  organizer:{
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  catogories:[{
    type: Types.ObjectId,
    ref: "Category"
  }]
},{
  versionKey: false,
  timestamps: true
})

export const eventModel = model("Event", eventSchema);

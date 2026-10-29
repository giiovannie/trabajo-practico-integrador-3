import { model, Types, Schema  } from "mongoose";

const categorySchema = new Schema({
    name:{
        type: String,
        unique: true,
        minlength: 2,
        maxlength: 30
    },
    description:{
        type: String,
        required: false,
        maxlength: 200
    },
},{
        timestamps: true,
        versionKey: false,
        toJSON:{virtuals: true},
        toObject: {virtuals: true}
})

categorySchema.virtual("events", {
    ref: "Event",
    localField: "_id",
    foreignField: "categories"
});

export const categoryModel = model("Category", categorySchema);
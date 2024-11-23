const mongoose = require("mongoose");
const Joi = require("joi");
// const { type } = require("server/reply");

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required."],
  },
  email: {
    type: String,
    required: [true, "email is required."],
  },
  phone: {
    type: Number,
    required: [true, "mobile number is required."],
  },
  designation: {
    type: String,
    required: [true, "designation is required."],
  },
  gender: {
    type: String,
    required:[true, "gender required."],
  },
  course:{
    type: String,
    required:[true, "what is your course?"],
  },
  createDate:{
    type: Date,
    default: Date.now,
    required:[true, "Date created"],
  },
  Image: {
    type: String, // Store the base64 string or a URL
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Employee = new mongoose.model("Employee", EmployeeSchema);

const validateEmployee = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    // address: Joi.string().min(4).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^[0-9]{7,15}$/) // Allows phone numbers between 7 and 15 digits.
      .required(),
    designation: Joi.string().required(),
    gender: Joi.string().required(),                 
    course: Joi.string().required(),
    createDate: Joi.date()
      .iso() // Ensures the date follows ISO 8601 format.
      .required(),
      Image: Joi.string().uri().required(),
  });

  return schema.validate(data);
};

module.exports = {
  validateEmployee,
  Employee,
};
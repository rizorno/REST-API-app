const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

// eslint-disable-next-line no-useless-escape
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionType = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    subscription: {
      type: String,
      enum: subscriptionType,
      default: "starter",
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "Missing required email field",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Missing required password field",
  }),
  subscription: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "Missing required email field",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Missing required password field",
  }),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionType)
    .required()
    .messages({ "any.required": "Missing field subscription" }),
});

const schemas = {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};

import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const usersSchema = mongoose.Schema(
  {
    parentId: {
      type: String, //mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide an email !"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email !",
      ],
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdminAuthorized: {
      type: Boolean,
      default: false,
    },
    userRole: {
      type: String,
      default: "role2",
    },
    mailPassword: {
      type: String,
    },
    mailSmtp: {
      type: String,
    },
    mailPort: {
      type: String,
    },
    pushSubscription:{
      type: Object
    }
  },
  { timestamps: true }
);

usersSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hashSync(user.password, salt);
    user.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

usersSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update?.$set?.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = bcrypt.hashSync(update?.$set?.password, salt);
      this.setUpdate({ ...update, password: hash });
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

usersSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compareSync(userPassword, this.password);
};

export const Users = mongoose.model("Users", usersSchema);

import mongoose from "mongoose";

export interface IUserAttrs {
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  lastLogin: Date;
}

interface UserModel extends mongoose.Model<IUserDoc> {
  build(attrs: IUserAttrs): IUserDoc;
}

export interface IUserDoc extends mongoose.Document {
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDoc>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
    },
    lastLogin: Date,
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

userSchema.statics.build = (attrs: IUserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<IUserDoc, UserModel>("User", userSchema);

export { User };

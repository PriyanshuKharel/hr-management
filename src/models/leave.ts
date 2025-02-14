import mongoose from "mongoose";

export interface ILeaveAttrs {
  name: string;
  message: string;
  leaveDate: Date | Date[];
}

interface LeaveModel extends mongoose.Model<ILeaveDoc> {
  build(attrs: ILeaveAttrs): ILeaveDoc;
}

export interface ILeaveDoc extends mongoose.Document {
  name: string;
  message: string;
  leaveDate: Date | Date[];
  createdAt: Date;
  updatedAt: Date;
}

const leaveSchema = new mongoose.Schema<ILeaveDoc>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    leaveDate: {
      type: [Date], // Array of dates
      required: true,
      validate: {
        validator: function (v: Date | Date[]) {
          // Allow both single date and array of dates
          return Array.isArray(v) ? v.length > 0 : v instanceof Date;
        },
        message: "At least one leave date is required",
      },
      // Convert single date to array automatically
      set: function (v: Date | Date[]) {
        return Array.isArray(v) ? v : [v];
      },
    },
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

leaveSchema.statics.build = (attrs: ILeaveAttrs) => {
  return new Leave(attrs);
};

const Leave = mongoose.model<ILeaveDoc, LeaveModel>("Leave", leaveSchema);

export { Leave };

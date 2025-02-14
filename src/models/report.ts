import mongoose from "mongoose";

export interface IReportAttrs {
  message: string;
}

interface ReportModel extends mongoose.Model<IReportDoc> {
  build(attrs: IReportAttrs): IReportDoc;
}

export interface IReportDoc extends mongoose.Document {
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new mongoose.Schema<IReportDoc>(
  {
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
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

reportSchema.statics.build = (attrs: IReportAttrs) => {
  return new Report(attrs);
};

const Report = mongoose.model<IReportDoc, ReportModel>("Report", reportSchema);

export { Report };

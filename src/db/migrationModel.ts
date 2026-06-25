import mongoose from "mongoose";

export interface IMigration extends mongoose.Document {
  name: string;
  executedAt: Date;
}

const migrationSchema = new mongoose.Schema<IMigration>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    executedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

const Migration = mongoose.model<IMigration>("Migration", migrationSchema);
export default Migration;

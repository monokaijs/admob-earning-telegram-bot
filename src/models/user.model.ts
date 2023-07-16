import mongoose, {Document} from "mongoose";

export interface UserDoc extends User, Document {
}

const schema = new mongoose.Schema<User>({
  firstName: String,
  lastName: String,
  username: String,
  languageCode: String,
  telegramId: String,
}, {
  timestamps: true,
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

export const UserModel = mongoose.model<UserDoc>("User", schema);

import mongoose, {Document} from "mongoose";

export interface AdmobConnectionDoc extends AdmobConnection, Document {
}

const schema = new mongoose.Schema<AdmobConnection>({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
  },
  defaultAccount: {
    name: String,
    publisherId: String,
    reportingTimeZone: String,
    currencyCode: String,
  },
  idToken: String,
  accessToken: String,
  refreshToken: String,
  expirationTime: Number,
}, {
  timestamps: true,
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

export const AdmobConnectionModel = mongoose.model<AdmobConnectionDoc>("AdmobConnection", schema);

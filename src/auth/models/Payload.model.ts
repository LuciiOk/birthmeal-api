import { Schema } from "mongoose";

export interface PayloadToken {
  sub: Schema.Types.ObjectId;
  role: string;
  userID?: Schema.Types.ObjectId;
}


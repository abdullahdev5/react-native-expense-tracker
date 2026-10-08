import { QueryFilter, Types } from "mongoose";
import { User } from "../models/User";
import { IUser, UpdateProfileDTO } from "../types/user";
import { HttpError } from "../utils/errors.util";
import { BUCKET_NAMES } from "../constants/supabaseConstants";
import { supabaseAdmin } from "../config/supabase";

class UserService {
  public async getUser(userId: string) {
    return User.findById(userId);
  }

  public async setBaseCurrency(userId: string, baseCurrency: string) {
    return await User.findByIdAndUpdate(
      userId,
      { baseCurrency }, // Update
      { returnDocument: "after" },
    );
  }

  public async updateProfile(userId: string, update: UpdateProfileDTO) {
    const userObjectId = new Types.ObjectId(userId);

    // const filter: QueryFilter<IUser> = { _id: new Types.ObjectId(userId) };

    const user = await User.findById(userObjectId);

    if (!user) {
      throw new HttpError("UnAuthorized!", 401);
    }

    if (update.picture) {
      // Delete Previous Profile Picture if Exists
      if (user.picture && user.picture.trim() !== "") {
        const bucketName = BUCKET_NAMES.PROFILE_IMAGES;
        const filePath = user.picture.getFilePathFromUrl(bucketName);

        const { data, error } = await supabaseAdmin.storage
          .from(bucketName)
          .remove([filePath]);

        if (error) {
          throw new HttpError("failed to remove the previous profile picture!", 500);
        }
      }
      // Upload New Profile Picture
      let picturePublicUrl: string | null = null;

      try {
        const fileName = `${update.name ?? user.name}-${update.picture.originalname}-${Date.now()}`;
        picturePublicUrl = await this.uploadUserPicture(update.picture, fileName);
      } catch (e) {
        throw new HttpError('failed to upload the new profile picture!', 500);
      }

      // Update Picture Url in Database
      user.picture = picturePublicUrl;
    }

    if (update.name) {
      user.name = update.name;
    }

    if (update.baseCurrency) {
      user.baseCurrency = update.baseCurrency;
    }

    // Save User with new Data
    await user.save();

    return user;
  }

  private async uploadUserPicture(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<string> {
    // will return publicUrl

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAMES.PROFILE_IMAGES)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    console.log("Upload Data: " + data);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage
      .from(BUCKET_NAMES.PROFILE_IMAGES)
      .getPublicUrl(fileName);

    return publicUrl;
  }
}

export const userService = new UserService();

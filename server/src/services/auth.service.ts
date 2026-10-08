import { User } from "../models/User";
import { AuthProvider, RegisterUserDTO, UserPayload } from "../types/user";
import { HttpError } from "../utils/errors.util";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { generateJwtToken } from "../utils/jwt.util";
import axios from "axios";
import { BUCKET_NAMES } from "../constants/supabaseConstants";
import { supabaseAdmin } from "../config/supabase";

// AuthService
class AuthService {
  private googleClient?: OAuth2Client;

  init() {
    if (!this.googleClient) {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new HttpError(
          "GOOGLE_CLIENT_ID is missing from the environment variables!",
          500,
        );
      }
      this.googleClient = new OAuth2Client(clientId);
    }
  }

  /* Public Functions */

  public async registerUser(
    data: RegisterUserDTO,
    pictureFile: Express.Multer.File | undefined,
  ) {
    const existingUser = await User.findOne({ email: data.email as string });

    if (existingUser) {
      throw new HttpError("This email is already Exists!", 401);
    }

    let picturePublicUrl: string | null = null;

    if (pictureFile) {
      try {
        const fileName = `${data.name}-${pictureFile.originalname}-${Date.now()}`;
        picturePublicUrl = await this.uploadUserPicture(pictureFile, fileName);
      } catch (e) {
        throw new HttpError('failed to upload the profile picture!', 500);
      }
    }

    const user = await User.create({
      ...data,
      picture: picturePublicUrl,
      provider: "email",
      baseCurrency: data.baseCurrency
    });

    return {
      user,
      token: generateJwtToken({ _id: user._id, email: user.email }),
    };
  }

  public async login(email: string, password: string) {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new HttpError("Inavlid Email!", 401);
    }

    if (!(await user.comparePassword(password))) {
      throw new HttpError("Invalid Credentials!", 401);
    }

    return {
      user,
      token: generateJwtToken({ _id: user._id, email: user.email }),
    };
  }

  public async loginWithGoogle(idToken: string, baseCurrency: string) {
    const googleUser = await this.verifyGoogelToken(idToken);

    if (!googleUser?.email) {
      throw new HttpError("Invalid Google Token!", 400);
    }

    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        name: googleUser.name || "Google User",
        email: googleUser.email,
        picture: googleUser.picture || null,
        provider: "google",
        providerId: googleUser.sub,
        baseCurrency: baseCurrency
      });
    }

    return {
      user,
      token: generateJwtToken({ _id: user._id, email: user.email }),
    };
  }

  public async loginWithFacebook(accessToken: string, baseCurrency: string) {
    const fbUser = await this.verifyFacebookToken(accessToken);

    let user = await User.findOne({ email: fbUser.email });

    if (!user) {
      user = await User.create({
        name: fbUser.name,
        email: fbUser.email,
        picture: fbUser.picture,
        provider: "facebook",
        providerId: fbUser.id,
        baseCurrency: baseCurrency
      });
    }

    return {
      user,
      token: generateJwtToken({ _id: user._id, email: user.email }),
    };
  }

  /* Private Functions */
  private async verifyGoogelToken(
    idToken: string,
  ): Promise<TokenPayload | undefined> {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new HttpError(
        "GOOGLE_CLIENT_ID is missing in the environment variables!",
      );
    }

    const ticket = await this.googleClient!.verifyIdToken({
      idToken,
      audience: clientId,
    });

    return ticket.getPayload();
  }

  private async verifyFacebookToken(accessToken: string) {
    // 1. Get an App Access Token (AppID|AppSecret)
    const appAccessToken = `${process.env.FB_APP_ID}|${process.env.FB_APP_SECRET}`;

    // Verify the token with the debug_token endpoint
    const debugResponse = await axios.get("https://graph.facebook.com/debug_token", {
      params: {
        input_token: accessToken,
        access_token: appAccessToken,
      },
    });

    const { data } = debugResponse.data;

    // Check if the token belongs to YOUR App ID
    if (!data.is_valid || data.app_id !== process.env.FB_APP_ID) {
      throw new HttpError("Invalid or unauthorized Facebook Token", 401);
    }

    // 4. Now safely fetch user details
    const userResponse = await axios.get("https://graph.facebook.com/me", {
      params: {
        fields: "id,name,email,picture",
        access_token: accessToken,
      },
    });

    return userResponse.data;
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

export const authService = new AuthService();

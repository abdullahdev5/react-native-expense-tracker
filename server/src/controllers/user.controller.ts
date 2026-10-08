import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import { responseHelper } from "../helpers/responseHelper";
import { UpdateProfileDTO, UpdateProfileRequestDTO } from "../types/user";

const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!._id;
    const user = await userService.getUser(userId.toString());
    // sending response
    return responseHelper.sendSuccess(
      res,
      user,
      "User fetched Successfully"
    );
  } catch (e: any) {
    next(e);
  }
}

const setBaseCurrency = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!._id;
        const { baseCurrency } = req.body;

        const newUser = await userService.setBaseCurrency(
          userId.toString(),
          baseCurrency
        );

        return responseHelper.sendSuccess(
            res,
            newUser,
            'Your base currency is set Successfully',
        );
    } catch (e) {
        next(e);
    }
}

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!._id;
    const pictureFile = req.file;

    const body: UpdateProfileRequestDTO = req.body;
    const updateData: UpdateProfileDTO = {};

    if (body.name) {
      updateData.name = body.name;
    }

    if (pictureFile) {
      updateData.picture = pictureFile;
    }

    if (body.baseCurrency) {
      updateData.baseCurrency = body.baseCurrency;
    }

    const user = await userService.updateProfile(userId.toString(), updateData);

    return responseHelper.sendSuccess(
      res,
      user,
      'Profile updated successfully',
    );
  } catch (e) {
    next(e);
  }
}


export { getUser, setBaseCurrency, updateProfile };
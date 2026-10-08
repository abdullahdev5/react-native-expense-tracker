import { Request, Response, NextFunction } from "express"
import { dashboardService } from "../services/dashboard.service";
import { responseHelper } from "../helpers/responseHelper";

const getDashboard = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!._id;
        const dashboardData = await dashboardService
            .getDashboard(userId.toString());

        return responseHelper.sendSuccess(
            res,
            dashboardData,
            'Dashboard Data Fetched Successfully!'
        );
    } catch (e) {
        next(e);
    }
};


export { getDashboard };
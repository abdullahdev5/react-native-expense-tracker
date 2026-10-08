import { Response } from "express";

export const responseHelper = {

    sendAuthSuccess: (res: Response, message: string = "Authenticated Successfully!", user: any, token: string) => {
        res.status(200).json({
            success: true,
            message,
            statusCode: 200,
            data: {
                token,
                user
            }
        });
    },

    sendSuccess: (res: Response, data: any, message: string = 'Success', statusCode: number = 200) => {
        return res.status(statusCode).json({
            success: true,
            statusCode,
            message,
            data,
        });
    },

    sendError: (res: Response, message: string = 'Internal Server Error', statusCode: number = 500, errors?: any) => {
        return res.status(statusCode).json({
            success: false,
            statusCode,
            message,
            ...(errors && { errors })
        });
    },

    sendUserNotFound: (res: Response) => {
        return res.status(404).json({
            success: false,
            stausCode: 404,
            message: "User not found!"
        });
    }

}
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../share/catchAsync';
import sendResponse from '../../share/sendResponse';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import { AuthService } from './auth.service';
import ApiError from '../../errors/ApiError';
import { ENUM_USER_ROLE } from '../../../enums/users';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { uid, role = ENUM_USER_ROLE.GENERAL_USER, ...payload } = req.body;

  let result = null;
  if (uid) {
    result = await AuthService.loginUserByUidFromDb(uid, role);
  } else {
    result = await AuthService.loginUserFromDb(payload);
  }
  const { refreshToken, ...othersData } = result;
  // console.log(req.cookies, 13);
  // set refresh token into cookie
  const cookieOptions = {
    // secure: config.env === 'production' ? true :false,
    //same
    secure: config.env === 'production',
    httpOnly: true,
  };
  //এটার মাধ্যমে ক্লাইন সাইডে আমার পাঠানো রেসপন্স এর বাইরেও অটোমেটিকলি সে এই cookie সেট করে দেবে
  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.cookie('accessToken', othersData.accessToken, cookieOptions);

  //set refre
  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successfull login',
    data: othersData,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token does not found');
  }
  const resultByAccessToken = await AuthService.refreshToken(refreshToken);

  const cookieOptions = {
    // secure: config.env === 'production' ? true :false,
    //same
    secure: config.env === 'production',
    httpOnly: true,
  };
  //এটার মাধ্যমে ক্লাইন সাইডে আমার পাঠানো রেসপন্স এর বাইরেও অটোমেটিকলি সে এই cookie সেট করে দেবে
  res.cookie('refreshToken', refreshToken, cookieOptions);

  //set refre
  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successfull login',
    data: resultByAccessToken,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
};

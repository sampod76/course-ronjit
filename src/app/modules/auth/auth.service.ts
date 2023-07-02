import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { User } from '../users/users.model';
import { ILoginUser, ILoginUserResponse } from './auth.interface';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helper/jwtHelpers';
import { GeneralUser } from '../generalUser/model.GeneralUser';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { Admin } from '../admin/admin.model';
import { Moderator } from '../moderator/moderator.model';

const loginUserFromDb = async (
  payload: ILoginUser
): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  if (!(email && password)) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Email and password not provide'
    );
  }

  const isUserExist = await User.isUserExist(email?.toLowerCase());
  //chack user
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  //match password
  if (!(await User.isPasswordMatched(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const accessToken = jwtHelpers.createToken(
    {
      role: isUserExist.role,
      email: isUserExist?.email,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    {
      role: isUserExist.role,
      email: isUserExist?.email,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

const loginUserByUidFromDb = async (
  uid: string,
  role: string
): Promise<ILoginUserResponse> => {
  let isUserExist = null;
  if (uid && role === ENUM_USER_ROLE.ADMIN) {
    isUserExist = await Admin.findOne({ uid });
  } else if (role === ENUM_USER_ROLE.MODERATOR) {
    isUserExist = await Moderator.findOne({ uid: uid });
  } else if (role === ENUM_USER_ROLE.GENERAL_USER) {
    isUserExist = await GeneralUser.findOne({ uid: uid });
  }

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const accessToken = jwtHelpers.createToken(
    {
      role: isUserExist.role,
      _id: isUserExist._id,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    {
      role: isUserExist.role,
      _id: isUserExist._id,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  // //chack this user exist database
  // const isUserExist = await User.isUserExist(verifiedToken?.userId);
  let isUserExist = null;
  if (verifiedToken._id && verifiedToken.role === ENUM_USER_ROLE.ADMIN) {
    isUserExist = await Admin.findById(verifiedToken._id);
  } else if (verifiedToken.role === ENUM_USER_ROLE.MODERATOR) {
    isUserExist = await Moderator.findById(verifiedToken._id);
  } else if (verifiedToken.role === ENUM_USER_ROLE.GENERAL_USER) {
    isUserExist = await GeneralUser.findById(verifiedToken._id);
  }
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    { email: isUserExist.email, role: isUserExist.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUserFromDb,
  loginUserByUidFromDb,
  refreshToken,
};

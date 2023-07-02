"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralUserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const constant_GeneralUser_1 = require("./constant.GeneralUser");
const model_GeneralUser_1 = require("./model.GeneralUser");
// import { IPurchased_courses } from '../purchased_courses/purchased_courses.interface';
// const {ObjectId}=mongoose.Types
const createGeneralUserByFirebaseFromDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    result = yield model_GeneralUser_1.GeneralUser.findOne({ uid: payload === null || payload === void 0 ? void 0 : payload.uid });
    if (!result) {
        result = yield model_GeneralUser_1.GeneralUser.create(payload);
    }
    return result;
});
const getAllGeneralUsersFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: constant_GeneralUser_1.GeneralUserSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield model_GeneralUser_1.GeneralUser.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield model_GeneralUser_1.GeneralUser.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleGeneralUserFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_GeneralUser_1.GeneralUser.findById(id).populate('purchase_courses.course', 'courseId title thumbnail createdAt');
    return result;
});
// user to course
const getUserToCourseFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_GeneralUser_1.GeneralUser.findById(id).populate('purchase_courses.course');
    return result;
});
// update user course vedio or quiz
const updateCourseVedioOrQuizFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { course_id, lessionId, quiz } = payload;
    let result = null;
    if (course_id && lessionId) {
        result = yield model_GeneralUser_1.GeneralUser.findOneAndUpdate({
            _id: id,
            'purchase_courses.course': course_id,
            'purchase_courses.total_completed_lessions': { $ne: lessionId },
        }, {
            $push: {
                'purchase_courses.$.total_completed_lessions': lessionId,
            },
        }, {
            new: true,
        });
    }
    if (quiz) {
        result = yield model_GeneralUser_1.GeneralUser.findOneAndUpdate({ _id: id, 'purchase_courses.course': course_id }, {
            $set: {
                'purchase_courses.$.quiz': quiz,
            },
        }, {
            new: true,
        });
    }
    return result;
});
// module 15 --> 14,15 vedio
const updateGeneralUserFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield model_GeneralUser_1.GeneralUser.findOne({ id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'GeneralUser not found !');
    }
    const GeneralUserData = __rest(payload, []);
    const updatedGeneralUserData = Object.assign({}, GeneralUserData);
    const result = yield model_GeneralUser_1.GeneralUser.findOneAndUpdate({ id }, updatedGeneralUserData, {
        new: true,
    });
    return result;
});
const deleteGeneralUserFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_GeneralUser_1.GeneralUser.findByIdAndDelete(id);
    return result;
});
exports.GeneralUserService = {
    createGeneralUserByFirebaseFromDb,
    getAllGeneralUsersFromDb,
    getSingleGeneralUserFromDb,
    getUserToCourseFromDb,
    updateGeneralUserFromDb,
    updateCourseVedioOrQuizFromDb,
    deleteGeneralUserFromDb,
};

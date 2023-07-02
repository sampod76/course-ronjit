"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const paginationHelper_1 = require("../../../helper/paginationHelper");
const consent_category_1 = require("./consent.category");
const model_category_1 = require("./model.category");
const createCategoryByDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_category_1.Category.create(payload);
    return result;
});
//getAllCategoryFromDb
const getAllCategoryFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filters start************/
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: consent_category_1.CATEGORY_SEARCHABLE_FIELDS.map(field => ({
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
    //****************search and filters end**********/
    //****************pagination start **************/
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //****************pagination end ***************/
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield model_category_1.Category.find(whereConditions)
        .sort(sortConditions)
        .skip(Number(skip))
        .limit(Number(limit));
    const total = yield model_category_1.Category.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// get single Categorye form db
const getSingleCategoryFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_category_1.Category.findById(id);
    return result;
});
// update Categorye form db
const updateCategoryFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_category_1.Category.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
// delete Categorye form db
const deleteCategoryByIdFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_category_1.Category.findByIdAndDelete(id);
    return result;
});
exports.CategoryService = {
    createCategoryByDb,
    getAllCategoryFromDb,
    getSingleCategoryFromDb,
    updateCategoryFromDb,
    deleteCategoryByIdFromDb,
};

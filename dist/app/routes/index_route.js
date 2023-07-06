"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const admin_route_1 = require("../modules/admin/admin.route");
const route_category_1 = require("../modules/category/route.category");
const course_route_1 = require("../modules/course/course.route");
const route_fileUploade_1 = require("../modules/fileUploade/route.fileUploade");
const route_GeneralUser_1 = require("../modules/generalUser/route.GeneralUser");
const lession_route_1 = require("../modules/lession/lession.route");
const moderator_route_1 = require("../modules/moderator/moderator.route");
const payment_router_1 = require("../modules/payment/payment.router");
const purchased_courses_route_1 = require("../modules/purchased_courses/purchased_courses.route");
const quiz_route_1 = require("../modules/quiz/quiz.route");
const photoContest_route_1 = require("../modules/photoContest/photoContest.route");
const run_contest_route_1 = require("../modules/run_contest/run_contest.route");
// import { UserRoute } from '../modules/users/users.router';
//https://docs.google.com/document/d/1gTsTpFvhfZB-2y0_BbZQVzmbG3YwsZwPrwAbsYqpOzM/edit
const router = express_1.default.Router();
const moduleRoutes = [
    // {
    //   path: '/users',
    //   route: UserRoute,
    // },
    {
        path: '/general-user',
        route: route_GeneralUser_1.GeneralUserRoutes,
    },
    {
        path: '/admin',
        route: admin_route_1.AdminRoutes,
    },
    {
        path: '/moderator',
        route: moderator_route_1.ModeratorRoutes,
    },
    {
        // only user login and refresh-token
        path: '/auth',
        route: auth_route_1.AuthRouter,
    },
    {
        path: '/course',
        route: course_route_1.CourseRoute,
    },
    {
        path: '/lession',
        route: lession_route_1.LessionRoute,
    },
    {
        path: '/quiz',
        route: quiz_route_1.QuizRoute,
    },
    {
        path: '/purchased-course',
        route: purchased_courses_route_1.Purchased_coursesRoute,
    },
    {
        path: '/category',
        route: route_category_1.CategoryRoute,
    },
    {
        path: '/payment',
        route: payment_router_1.PaymentRoute,
    },
    {
        path: '/photo-contest-join',
        route: photoContest_route_1.PhotoContestUserRoute,
    },
    {
        path: '/run-contest',
        route: run_contest_route_1.RunContestRoute,
    },
    {
        path: '/upload',
        route: route_fileUploade_1.FileUploadeRoute,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;

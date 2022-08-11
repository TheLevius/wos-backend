"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUSES = exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const port = 3000;
exports.HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
};
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
const db = {
    courses: [
        { id: 1, title: 'front-end' },
        { id: 2, title: 'back-end' },
        { id: 3, title: 'automation qa' },
        { id: 4, title: 'devops' },
    ]
};
exports.app.get('/', (req, res) => {
    res.send('Hello World!');
});
exports.app.get('/courses', (req, res) => {
    var _a;
    const foundCourses = (_a = db.courses) !== null && _a !== void 0 ? _a : [];
    if (req.query.title && !foundCourses.length) {
        const queryTitle = req.query.title;
        const filteredFoundCoursesQuery = foundCourses.filter((c) => c.title.indexOf(queryTitle) > -1);
        res.json(filteredFoundCoursesQuery);
    }
    else {
        res.json(foundCourses);
    }
    res.json(db.courses);
});
exports.app.get('/courses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const foundCourse = db.courses.find((c) => c.id === id);
    if (!foundCourse) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(foundCourse);
});
exports.app.post('/courses', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(exports.HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(createdCourse);
    res.status(exports.HTTP_STATUSES.CREATED_201);
    res.json(createdCourse);
});
exports.app.delete('/courses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.courses = db.courses.filter((c) => c.id !== id);
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.put('/courses/:id', (req, res) => {
    var _a;
    if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.title)) {
        res.sendStatus(exports.HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const id = parseInt(req.params.id);
    const foundCourseId = db.courses.findIndex((c) => c.id === id);
    if (foundCourseId === -1) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    db.courses[foundCourseId].title = req.body.title;
    res.json(db.courses[foundCourseId]);
});
exports.app.delete('/__test__/data', (req, res) => {
    db.courses = [];
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

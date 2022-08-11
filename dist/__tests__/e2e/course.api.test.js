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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../../src");
describe('/courses', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).delete('/__test__/data');
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .get('/courses')
            .expect(src_1.HTTP_STATUSES.OK_200, []);
    }));
    it('should return 404 for not existing course', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .get('/courses/1')
            .expect(src_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it(`should'nt create course with incorrect input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .post('/courses')
            .send({ title: '' })
            .expect(src_1.HTTP_STATUSES.BAD_REQUEST_400);
    }));
    let createdCourse1 = null;
    it(`should create course with correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(src_1.app)
            .post('/courses')
            .send({ title: 'it-incubator test' })
            .expect(src_1.HTTP_STATUSES.CREATED_201);
        createdCourse1 = response.body;
        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: 'it-incubator test'
        });
        yield (0, supertest_1.default)(src_1.app)
            .get('/courses')
            .expect(src_1.HTTP_STATUSES.OK_200, [createdCourse1]);
    }));
    let createdCourse2 = null;
    it(`create one more course`, () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(src_1.app)
            .post('/courses')
            .send({ title: 'it-incubator test 2' })
            .expect(src_1.HTTP_STATUSES.CREATED_201);
        createdCourse2 = response.body;
        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: 'it-incubator test 2'
        });
        yield (0, supertest_1.default)(src_1.app)
            .get('/courses')
            .expect(src_1.HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2]);
    }));
    it(`should'nt update course with incorrect input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        yield (0, supertest_1.default)(src_1.app)
            .put(`/courses/${(_a = createdCourse1 === null || createdCourse1 === void 0 ? void 0 : createdCourse1.id) !== null && _a !== void 0 ? _a : ''}`)
            .send({ title: '' })
            .expect(src_1.HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(src_1.app)
            .get(`/courses/${(_b = createdCourse1 === null || createdCourse1 === void 0 ? void 0 : createdCourse1.id) !== null && _b !== void 0 ? _b : ''}`)
            .expect(src_1.HTTP_STATUSES.OK_200, createdCourse1);
    }));
    it(`should'nt update course that not exist`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .put(`/courses/2`)
            .send({ title: 'good title' })
            .expect(src_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it(`should update course with correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d, _e;
        yield (0, supertest_1.default)(src_1.app)
            .put(`/courses/${(_c = createdCourse1 === null || createdCourse1 === void 0 ? void 0 : createdCourse1.id) !== null && _c !== void 0 ? _c : ''}`)
            .send({ title: 'good new title' })
            .expect(src_1.HTTP_STATUSES.OK_200);
        yield (0, supertest_1.default)(src_1.app)
            .get(`/courses/${(_d = createdCourse1 === null || createdCourse1 === void 0 ? void 0 : createdCourse1.id) !== null && _d !== void 0 ? _d : ''}`)
            .expect(src_1.HTTP_STATUSES.OK_200, Object.assign(Object.assign({}, createdCourse1), { title: 'good new title' }));
        yield (0, supertest_1.default)(src_1.app)
            .get(`/courses/${(_e = createdCourse2 === null || createdCourse2 === void 0 ? void 0 : createdCourse2.id) !== null && _e !== void 0 ? _e : ''}`)
            .expect(src_1.HTTP_STATUSES.OK_200, createdCourse2);
    }));
    it('should delete both courses', () => __awaiter(void 0, void 0, void 0, function* () {
        var _f, _g, _h, _j;
        yield (0, supertest_1.default)(src_1.app)
            .delete(`/courses/${(_f = createdCourse1 === null || createdCourse1 === void 0 ? void 0 : createdCourse1.id) !== null && _f !== void 0 ? _f : ''}`)
            .expect(src_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(src_1.app)
            .get(`/courses/${(_g = createdCourse1 === null || createdCourse1 === void 0 ? void 0 : createdCourse1.id) !== null && _g !== void 0 ? _g : ''}`)
            .expect(src_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(src_1.app)
            .delete(`/courses/${(_h = createdCourse2 === null || createdCourse2 === void 0 ? void 0 : createdCourse2.id) !== null && _h !== void 0 ? _h : ''}`)
            .expect(src_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(src_1.app)
            .get(`/courses/${(_j = createdCourse2 === null || createdCourse2 === void 0 ? void 0 : createdCourse2.id) !== null && _j !== void 0 ? _j : ''}`)
            .expect(src_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(src_1.app)
            .get(`/courses`)
            .expect(src_1.HTTP_STATUSES.OK_200, []);
    }));
});

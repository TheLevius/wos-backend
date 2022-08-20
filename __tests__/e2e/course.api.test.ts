import request from 'supertest';
import {app, HTTP_STATUSES} from '../../src';
import {CreateCourseModel} from "../../src/models/CreateCourseModel";
import {UpdateCourseModel} from "../../src/models/UpdateCourseModel";

type CourseItem = {
    id: number;
    title: string;
} | null;
describe('/courses', () => {
    beforeAll(async () => {
        await request(app).delete('/__test__/data');
    })
    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    });
    it('should return 404 for not existing course', async () => {
        await request(app)
            .get('/courses/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    });
    it(`should'nt create course with incorrect input data`, async () => {
        const data: CreateCourseModel = { title: 'it-incubator course' }

        await request(app)
            .post('/courses')
            .send({ title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    });

    let createdCourse1: CourseItem = null;
    it(`should create course with correct input data`, async () => {

        const response = await request(app)
            .post('/courses')
            .send({ title: 'it-incubator test'})
            .expect(HTTP_STATUSES.CREATED_201);

        createdCourse1 = response.body;

        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: 'it-incubator test'
        })
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1])
    });
    let createdCourse2: CourseItem = null;
    it(`create one more course`, async () => {
        const data: CreateCourseModel = { title: 'it-incubator course 2' }
        const response = await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201);

        createdCourse2 = response.body;

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: data.title
        })
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    });

    it(`should'nt update course with incorrect input data`, async () => {

        const data: CreateCourseModel = { title: '' }

        await request(app)
            .put(`/courses/${createdCourse1?.id ?? ''}`)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)


        await request(app)
            .get(`/courses/${createdCourse1?.id ?? ''}`)
            .expect(HTTP_STATUSES.OK_200, createdCourse1)
    });
    it(`should'nt update course that not exist`, async () => {

        await request(app)
            .put(`/courses/2`)
            .send({ title: 'good title'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)

    });
    it(`should update course with correct input data`, async () => {

        const data: UpdateCourseModel = { title: 'good new title' }

        await request(app)
            .put(`/courses/${createdCourse1?.id ?? ''}`)
            .send(data)
            .expect(HTTP_STATUSES.OK_200)

        await request(app)
            .get(`/courses/${createdCourse1?.id ?? ''}`)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourse1,
                title: data.title
            })
        await request(app)
            .get(`/courses/${createdCourse2?.id ?? ''}`)
            .expect(HTTP_STATUSES.OK_200, createdCourse2)
    });
    it('should delete both courses', async () => {
        await request(app)
            .delete(`/courses/${createdCourse1?.id ?? ''}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        await request(app)
            .get(`/courses/${createdCourse1?.id ?? ''}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
        await request(app)
            .delete(`/courses/${createdCourse2?.id ?? ''}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        await request(app)
            .get(`/courses/${createdCourse2?.id ?? ''}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
        await request(app)
            .get(`/courses`)
            .expect(HTTP_STATUSES.OK_200, [])
    });

})
import express, { Request, Response } from 'express'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";
import {CourseViewModel} from "./models/CourseViewModel";
import {URIParamsCourseModel} from "./models/URIParamsCourseModel";
import {UpdateCourseModel} from "./models/UpdateCourseModel";

export const app = express()
const port = 3000

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware)

const db: { courses: CourseType[] } = {
    courses: [
        {id: 1, title: 'front-end', studentsCount: 10 },
        {id: 2, title: 'back-end', studentsCount: 10 },
        {id: 3, title: 'automation qa', studentsCount: 10 },
        {id: 4, title: 'devops', studentsCount: 10 },
    ]
}

const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => ({
    id: dbCourse.id,
    title: dbCourse.title
});

type CourseType = {
    id: number;
    title: string;
    studentsCount: number;
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/courses', (req: RequestWithQuery<{ title: string }>, res: Response<CourseViewModel[]>) => {

    const foundCourses = db.courses ?? [];
    if (foundCourses.length === 0) {
        res.json(foundCourses);
    }
    if (req.query.title) {
        const queryTitle = req.query.title;
        const filteredFoundCoursesQuery = foundCourses.filter((c) => c.title.indexOf(queryTitle as string) > -1);
        res.json(filteredFoundCoursesQuery);
    }

    res.json(foundCourses.map(getCourseViewModel))
})
app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseModel>, res: Response<CourseViewModel>) => {
    const id = parseInt(req.params.id);
    const foundCourse = db.courses.find((c) => c.id === id)
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(getCourseViewModel(foundCourse));
})
app.post('/courses', (req: RequestWithBody<{ title: string }>, res: Response<CourseViewModel>) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const createdCourse: CourseType = {
        id: +(new Date()),
        title: req.body.title,
        studentsCount: 0
    };
    db.courses.push(createdCourse);
    res.status(HTTP_STATUSES.CREATED_201);
    res.json(getCourseViewModel(createdCourse));
})

app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseModel>, res) => {
    const id = parseInt(req.params.id);
    db.courses = db.courses.filter((c) => c.id !== id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})
app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseModel, UpdateCourseModel>, res) => {

    if (!req.body?.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const id = parseInt(req.params.id);
    const foundCourseId = db.courses.findIndex((c) => c.id === id)
    if (foundCourseId === -1) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    db.courses[foundCourseId].title = req.body.title;

    res.json(db.courses[foundCourseId]);
})

app.delete('/__test__/data', (req, res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
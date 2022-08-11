import express from 'express'

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

const db = {
    courses: [
        {id: 1, title: 'front-end'},
        {id: 2, title: 'back-end'},
        {id: 3, title: 'automation qa'},
        {id: 4, title: 'devops'},
    ]
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/courses', (req, res) => {

    const foundCourses = db.courses ?? [];

    if (req.query.title && !foundCourses.length) {
        const queryTitle = req.query.title;
        const filteredFoundCoursesQuery = foundCourses.filter((c) => c.title.indexOf(queryTitle as string) > -1);
        res.json(filteredFoundCoursesQuery);
    } else {
        res.json(foundCourses);
    }

    res.json(db.courses)
})
app.get('/courses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const foundCourse = db.courses.find((c) => c.id === id)
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(foundCourse);
})
app.post('/courses', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(createdCourse);
    res.status(HTTP_STATUSES.CREATED_201);
    res.json(createdCourse);
})

app.delete('/courses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.courses = db.courses.filter((c) => c.id !== id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})
app.put('/courses/:id', (req, res) => {

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
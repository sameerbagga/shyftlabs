const express = require('express');
const router = express.Router();
const errorHandler = require('../helpers/errorHandler');
const dbConn = require('../helpers/dbConnection');
const CustomErrors = require('../helpers/error');
const { validateInteger } = require('../helpers/validate');


router.get('/', getCourses);
router.post('/', addCourse);
router.delete('/:id', deleteCourseById);


async function getCourses(req, res, next) {
    try {
        const courseList = await dbConn.select('*').from('courses').orderBy('id');
        return res.json(courseList);
    } catch (err) {
        return next(errorHandler({ error: err }));
    }
}


async function addCourse(req, res, next) {
    try {
        if (!req.body.courseName) {
            return next(new CustomErrors("CourseName is required"));
        }
        await dbConn('courses').insert({ name: req.body.courseName });
        return res.sendStatus(201);
    } catch (err) {
        return next(errorHandler({ error: err }));
    }
}


async function deleteCourseById(req, res, next) {
    try {
        const courseId = req.params.id;
        if (!validateInteger(courseId)) {
            return next(new CustomErrors("Enter valid courseId (integer)", 400));
        }
        let courseDeleted = await dbConn('courses')
            .returning('id')
            .del()
            .where('id', courseId);
        if (!courseDeleted.length) {
            return next(new CustomErrors("courseId - " + courseId + " not found", 404));
        }
        return res.sendStatus(204);
    } catch (err) {
        return next(errorHandler({ error: err }));
    }
}


module.exports = router;
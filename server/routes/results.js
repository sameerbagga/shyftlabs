const express = require('express');
const router = express.Router();
const errorHandler = require('../helpers/errorHandler');
const dbConn = require('../helpers/dbConnection');
const CustomErrors = require('../helpers/error');
const { validateInteger } = require('../helpers/validate');


router.get('/', getResults);
router.post('/', postResult);


async function getResults(req, res, next) {
    try {
        const resultsData = await dbConn.select('c.name as course', 's.first_name', 's.family_name', 'r.score')
            .from('results as r')
            .innerJoin('students as s', 's.id', 'r.student_id')
            .innerJoin('courses as c', 'c.id', 'r.course_id');
        return res.json(resultsData);
    } catch (err) {
        return next(errorHandler({ error: err }));
    }
}


async function postResult(req, res, next) {
    try {
        const studentId = req.body.studentId;
        const courseId = req.body.courseId;
        const score = req.body.score;
        let studentError = !(studentId || validateInteger(studentId));
        let courseError = !(courseId || validateInteger(courseId));
        let scoreError = !((score && score != 0) || validateInteger(score));
        if (studentError || courseError || scoreError) {
            let errorObj = {
                studentId: studentError ? 'Enter valid studentId (integer)' : undefined,
                courseId: courseError ? 'Enter valid courseId (integer)' : undefined,
                score: scoreError ? 'Enter valid score (integer)' : undefined
            };
            return next(new CustomErrors(errorObj, 400));
        }
        await dbConn('results').insert({
            student_id: studentId,
            course_id: courseId,
            score: score
        });
        return res.sendStatus(201);
    } catch (err) {
        return next(errorHandler({ error: err }));
    }
}


module.exports = router;
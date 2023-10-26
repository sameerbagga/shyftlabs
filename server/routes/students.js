const express = require('express');
const router = express.Router();
const errorHandler = require('../helpers/errorHandler');
const dbConn = require('../helpers/dbConnection');
const CustomErrors = require('../helpers/error');
const { AgeFromDateString } = require('age-calculator');
const Ajv = require("ajv");
const addFormats = require("ajv-formats")
const ajv = new Ajv();
addFormats(ajv);
const { types } = require('pg');
const { validateInteger } = require('../helpers/validate');


// Set knex to read date-only columns without timestamp
const DATE_OID = 1082;
const parseDate = (value) => value;
types.setTypeParser(DATE_OID, parseDate);


router.get('/', getStudents);
router.post('/', addStudent);
router.delete('/:id', deleteStudentById);


const studentSchema = {
    type: "object",
    properties: {
        firstName: { type: "string" },
        familyName: { type: "string" },
        dob: { type: "string", format: "date" },
        email: { type: "string", format: "email" }
    },
    required: ["firstName", "familyName", "dob", "email"],
    additionalProperties: false,
};



async function getStudents(req, res, next) {
    try {
        const studentsData = await dbConn.select('*').from('students');
        return res.json(studentsData);
    } catch (err) {
        return next(errorHandler({ error: err }));
    }
}


function validAge(dob) {
    if (new AgeFromDateString(dob).age < 10) {
        return false;
    }
    return true;
}


async function addStudent(req, res, next) {
    try {
        const validate = ajv.compile(studentSchema);
        const valid = validate(req.body);
        if (!valid) {
            console.log(validate.errors);
            return next(new CustomErrors(validate.errors, 400));
        }
        if (!validAge(req.body.dob)) {
            return next(new CustomErrors("Cannot Register student with age < 10 years", 403));
        }
        const studentData = {
            first_name: req.body.firstName,
            family_name: req.body.familyName,
            dob: req.body.dob,
            email: req.body.email
        };
        await dbConn('students').insert(studentData);
        return res.sendStatus(201);
    } catch (err) {
        return next(errorHandler({ error: err }));
    }
}


async function deleteStudentById(req, res, next) {
    try {
        const studentId = req.params.id;
        if (!validateInteger(studentId)) {
            return next(new CustomErrors("Enter valid studentId (integer)", 400));
        }
        let studentDeleted = await dbConn('students')
            .returning('id')
            .del()
            .where('id', studentId);
        if (!studentDeleted.length) {
            return next(new CustomErrors("studentId - " + studentId + " not found", 404));
        }
        return res.sendStatus(204);
    } catch (err) {
        return next(errorHandler({ error: err }));
    }
}


module.exports = router;
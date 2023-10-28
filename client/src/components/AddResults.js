import React, { useEffect, useState } from 'react';
import {
    Button,
    notification,
    Form,
    Select
} from 'antd';
import SubmissionError from './SubmissionError';


const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};


const AddResults = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [errorFaced, setErrorFaced] = useState(false);
    const [err, setErr] = useState([]);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Success',
            description:
                'Course added successfully',
        });
    };

    const scores = [
        {
            value: "A",
            label: "A",
        },
        {
            value: "B",
            label: "B",
        },
        {
            value: "C",
            label: "C",
        },
        {
            value: "D",
            label: "D",
        },
        {
            value: "E",
            label: "E",
        },
        {
            value: "F",
            label: "F",
        }
    ];

    useEffect(() => {
        fetchStudentsData();
        fetchCoursesData();
    }, []);

    const fetchStudentsData = async () => {
        const resp = await fetch("/students");
        if (!resp.ok) {
            setErrorFaced(true);
            let e = await resp.json();
            setErr(e.errors);
            return
        }
        const parsedResp = await resp.json();
        let studentsArray = [];
        parsedResp.map(e => {
            e.name = e.first_name + " " + e.family_name
            e.key = e.id
            delete e.first_name;
            delete e.family_name;
            studentsArray.push(
                {
                    value: e.id,
                    label: e.name + " - " + e.dob,
                }
            )
            return e;
        });
        setStudents(studentsArray);
    }

    const fetchCoursesData = async () => {
        const resp = await fetch("/courses");
        if (!resp.ok) {
            setErrorFaced(true);
            let e = await resp.json();
            setErr(e.errors);
            return
        }
        const parsedResp = await resp.json();
        let coursesArray = [];
        parsedResp.map(e => {
            e.key = e.id;
            coursesArray.push(
                {
                    value: e.id,
                    label: e.name,
                }
            )
            return e;
        });
        setCourses(coursesArray);
    }

    const onFinish = async (values) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        };
        let resp = await fetch('/results', requestOptions)
        if (!resp.ok) {
            setErrorFaced(true);
            let e = await resp.json();
            setErr(e.errors);
            return
        }
        openNotificationWithIcon("success");
        form.resetFields();
    };

    const resetErrorFaced = () => {
        setErrorFaced(false);
    }

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    if (errorFaced) {
        return (
            <SubmissionError prevPage={window.location.pathname} resetError={resetErrorFaced} err={err} />
        )
    }

    return (
        <>
            {contextHolder}
            <Form
                {...formItemLayout}
                form={form}
                name="addResults"
                onFinish={onFinish}
                style={{
                    maxWidth: 600,
                }}
                scrollToFirstError
            >

                <Form.Item>
                    <h1>Add New Results</h1>
                </Form.Item>

                <Form.Item
                    name="studentId"
                    label="Student Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please select Student',
                        },
                    ]}
                >
                    <Select
                        showSearch
                        allowClear
                        size="middle"
                        placeholder="Select Student"
                        style={{
                            width: '100%',
                        }}
                        filterOption={filterOption}
                        options={students}
                    />
                </Form.Item>

                <Form.Item
                    name="courseId"
                    label="Course Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please select Course',
                        },
                    ]}
                >
                    <Select
                        showSearch
                        allowClear
                        size="middle"
                        placeholder="Select Course"
                        style={{
                            width: '100%',
                        }}
                        filterOption={filterOption}
                        options={courses}
                    />
                </Form.Item>

                <Form.Item
                    name="score"
                    label="Score"
                    rules={[
                        {
                            required: true,
                            message: 'Please select Score',
                        },
                    ]}
                >
                    <Select
                        showSearch
                        allowClear
                        size="middle"
                        placeholder="Select Score"
                        style={{
                            width: '100%',
                        }}
                        filterOption={filterOption}
                        options={scores}
                    />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};


export default AddResults;
import React, { useState } from 'react';
import {
    Button,
    notification,
    Form,
    Input,
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


const AddCourses = () => {
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

    const onFinish = async (values) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        };
        let resp = await fetch('/courses', requestOptions)
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
                name="addCourse"
                onFinish={onFinish}
                style={{
                    maxWidth: 600,
                }}
                scrollToFirstError
            >

                <Form.Item>
                    <h1>Add Course</h1>
                </Form.Item>

                <Form.Item
                    name="courseName"
                    label="Course Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input new Course Name',
                        },
                    ]}
                >
                    <Input allowClear />
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


export default AddCourses;
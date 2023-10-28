import React, { useState } from 'react';
import {
    Button,
    DatePicker,
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


const AddStudents = () => {
    const [errorFaced, setErrorFaced] = useState(false);
    const [err, setErr] = useState([]);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Success',
            description:
                'Student added successfully',
        });
    };

    const onFinish = async (values) => {
        values["dob"] = values["dob"].format('YYYY-MM-DD');

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        };
        let resp = await fetch('/students', requestOptions)
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
                name="addStudent"
                onFinish={onFinish}
                style={{
                    maxWidth: 600,
                }}
                scrollToFirstError
            >

                <Form.Item>
                    <h1>Add Student Details</h1>
                </Form.Item>

                <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your First Name',
                        },
                    ]}
                >
                    <Input allowClear />
                </Form.Item>

                <Form.Item
                    name="familyName"
                    label="Family Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Family Name',
                        },
                    ]}
                >
                    <Input allowClear />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input allowClear />
                </Form.Item>

                <Form.Item
                    name="dob"
                    label="DOB"
                    rules={[
                        {
                            type: 'object',
                            required: true,
                            message: 'Please select DOB!'
                        }
                    ]}
                >
                    <DatePicker />
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


export default AddStudents;
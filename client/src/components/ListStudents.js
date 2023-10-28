import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Flex } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import SubmissionError from './SubmissionError';
import moment from 'moment';


const ListStudents = () => {
    const [errorFaced, setErrorFaced] = useState(false);
    const [err, setErr] = useState([]);
    const [data, setData] = useState([]);
    const [nameFilter, setNameFilter] = useState([]);
    const [emailFilter, setEmailFilter] = useState([]);
    const [dobFilter, setDobFilter] = useState([]);

    useEffect(() => {
        fetchStudentsData();
    }, []);

    const resetErrorFaced = () => { setErrorFaced(false) }

    const fetchStudentsData = async () => {
        const resp = await fetch("/students");
        if (!resp.ok) {
            setErrorFaced(true);
            let e = await resp.json();
            setErr(e.errors);
            return
        }
        const parsedResp = await resp.json();
        let nameFilterObj = {};
        let emailFilterObj = {};
        let dobFilterObj = {};

        let nameFilterData = [];
        let emailFilterData = [];
        let dobFilterData = [];
        const trasnformedResp = parsedResp.map(e => {
            e.name = e.first_name + " " + e.family_name
            e.key = e.id
            delete e.first_name;
            delete e.family_name;
            nameFilterObj[e.name] = 1;
            emailFilterObj[e.email] = 1;
            dobFilterObj[moment(e.dob).year()] = 1;
            return e;
        });
        let nameFilterArray = Object.keys(nameFilterObj);
        let emailFilterArray = Object.keys(emailFilterObj);
        let dobFilterArray = Object.keys(dobFilterObj);
        for (let i = 0; i < trasnformedResp.length; i++) {
            if (nameFilterArray[i]) {
                nameFilterData.push(
                    {
                        text: nameFilterArray[i],
                        value: nameFilterArray[i]
                    }
                )
            }
            if (emailFilterArray[i]) {
                emailFilterData.push(
                    {
                        text: emailFilterArray[i],
                        value: emailFilterArray[i]
                    }
                )
            }
            if (dobFilterArray[i]) {
                dobFilterData.push(
                    {
                        text: dobFilterArray[i],
                        value: dobFilterArray[i]
                    }
                )
            }
        }
        setNameFilter(nameFilterData);
        setEmailFilter(emailFilterData);
        setDobFilter(dobFilterData);
        setData(trasnformedResp);
    }

    const deleteStudent = async (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };
        let resp = await fetch('/students/' + id, requestOptions)
        if (!resp.ok) {
            setErrorFaced(true);
            let e = await resp.json();
            setErr(e.errors);
            return false;
        }
        return true;
    }

    const handleDelete = async (id) => {
        if (!await deleteStudent(id)) {
            return
        }
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
    };

    const columns = [
        {
            title: 'Name & Family name',
            dataIndex: 'name',
            key: 'name',
            filters: nameFilter,
            filterSearch: true,
            onFilter: (value, record) => record.name.startsWith(value),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'DOB',
            dataIndex: 'dob',
            key: 'dob',
            filters: dobFilter,
            filterSearch: true,
            onFilter: (value, record) => record.dob.startsWith(value),
            sorter: (a, b) => moment(a.dob).unix() - moment(b.dob).unix()
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            filters: emailFilter,
            filterSearch: true,
            onFilter: (value, record) => record.email.startsWith(value),
            sorter: (a, b) => a.email.localeCompare(b.email)
        },
        {
            title: 'Delete',
            key: 'delete',
            render: (_, record) =>
                data.length >= 1 ? (
                    <Space size="middle">
                        <Button shape="circle" type="text" onClick={() => handleDelete(record.id)}><CloseOutlined /></Button>
                    </Space>
                ) : null,
        },
    ];

    if (errorFaced) {
        return (
            <SubmissionError prevPage={window.location.pathname} resetError={resetErrorFaced} err={err} />
        )
    }

    return (
        <>
            <h1> Students List</h1>
            <Flex justify='flex-end' align='flex-start'>
                <Button type="default" onClick={() => fetchStudentsData()}>
                    Refresh
                </Button>
            </Flex>
            <Table columns={columns} dataSource={data} />
        </>
    );
}


export default ListStudents;
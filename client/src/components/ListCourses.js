import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Flex } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import SubmissionError from './SubmissionError';


const ListCourses = () => {
    const [errorFaced, setErrorFaced] = useState(false);
    const [err, setErr] = useState([]);
    const [data, setData] = useState([]);
    const [nameFilter, setNameFilter] = useState([]);

    useEffect(() => {
        fetchCoursesData();
    }, []);

    const resetErrorFaced = () => { setErrorFaced(false) }

    const fetchCoursesData = async () => {
        const resp = await fetch("/courses");
        if (!resp.ok) {
            setErrorFaced(true);
            let e = await resp.json();
            setErr(e.errors);
            return
        }
        const parsedResp = await resp.json();
        let nameFilterData = [];
        const trasnformedResp = parsedResp.map(e => {
            e.key = e.id;
            nameFilterData.push(
                {
                    text: e.name,
                    value: e.name
                }
            )
            return e;
        });
        setNameFilter(nameFilterData);
        setData(trasnformedResp);
    }

    const deleteCourse = async (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };
        let resp = await fetch('/courses/' + id, requestOptions)
        if (!resp.ok) {
            setErrorFaced(true);
            let e = await resp.json();
            setErr(e.errors);
            return false;
        }
        return true;
    }

    const handleDelete = async (id) => {
        if (!await deleteCourse(id)) {
            return
        }
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
    };

    const columns = [
        {
            title: 'Course Name',
            dataIndex: 'name',
            key: 'name',
            filters: nameFilter,
            filterSearch: true,
            onFilter: (value, record) => record.name.startsWith(value),
            sorter: (a, b) => a.name.localeCompare(b.name),
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
            <h1> Course List</h1>
            <Flex justify='flex-end' align='flex-start'>
                <Button type="default" onClick={() => fetchCoursesData()}>
                    Refresh
                </Button>
            </Flex>
            <Table columns={columns} dataSource={data} />
        </>
    );
}


export default ListCourses;
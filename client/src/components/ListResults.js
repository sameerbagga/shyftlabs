import React, { useEffect, useState } from 'react';
import { Button, Table, Flex } from 'antd';
import SubmissionError from './SubmissionError';


const ListResults = () => {
    const [errorFaced, setErrorFaced] = useState(false);
    const [err, setErr] = useState([]);
    const [data, setData] = useState([]);
    const [nameFilter, setNameFilter] = useState([]);
    const [courseFilter, setCourseFilter] = useState([]);
    const [scoreFilter, setScoreFilter] = useState([]);

    useEffect(() => {
        fetchResultsData();
    }, []);

    const resetErrorFaced = () => { setErrorFaced(false) }

    const fetchResultsData = async () => {
        const resp = await fetch("/results");
        if (!resp.ok) {
            setErrorFaced(true);
            let e = await resp.json();
            setErr(e.errors);
            return
        }
        const parsedResp = await resp.json();
        let nameFilterObj = {};
        let courseFilterObj = {};
        let scoreFilterObj = {};

        let nameFilterData = [];
        let courseFilterData = [];
        let scoreFilterData = [];
        const trasnformedResp = parsedResp.map(e => {
            e.name = e.first_name + " " + e.family_name
            e.key = e.uid
            delete e.first_name;
            delete e.family_name;
            nameFilterObj[e.name] = 1;
            courseFilterObj[e.course] = 1;
            scoreFilterObj[e.score] = 1;
            return e;
        });
        let nameFilterArray = Object.keys(nameFilterObj);
        let courseFilterArray = Object.keys(courseFilterObj);
        let scoreFilterArray = Object.keys(scoreFilterObj);

        for (let i = 0; i < trasnformedResp.length; i++) {
            if (nameFilterArray[i]) {
                nameFilterData.push(
                    {
                        text: nameFilterArray[i],
                        value: nameFilterArray[i]
                    }
                )
            }
            if (courseFilterArray[i]) {
                courseFilterData.push(
                    {
                        text: courseFilterArray[i],
                        value: courseFilterArray[i]
                    }
                )
            }
            if (scoreFilterArray[i]) {
                scoreFilterData.push(
                    {
                        text: scoreFilterArray[i],
                        value: scoreFilterArray[i]
                    }
                )
            }
        }
        setNameFilter(nameFilterData);
        setCourseFilter(courseFilterData);
        setScoreFilter(scoreFilterData);
        setData(trasnformedResp);
    }


    const columns = [
        {
            title: 'Course',
            dataIndex: 'course',
            key: 'course',
            filters: courseFilter,
            filterSearch: true,
            onFilter: (value, record) => record.course.startsWith(value),
            sorter: (a, b) => a.course.localeCompare(b.course),
        },
        {
            title: 'Student',
            dataIndex: 'name',
            key: 'name',
            filters: nameFilter,
            filterSearch: true,
            onFilter: (value, record) => record.name.startsWith(value),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            filters: scoreFilter,
            filterSearch: true,
            onFilter: (value, record) => record.score.toString().startsWith(value),
            sorter: (a, b) => a.score.toString().localeCompare(b.score.toString()),
        },
    ];

    if (errorFaced) {
        return (
            <SubmissionError prevPage={window.location.pathname} resetError={resetErrorFaced} err={err} />
        )
    }

    return (
        <>
            <h1> Results List</h1>
            <Flex justify='flex-end' align='flex-start'>
                <Button type="default" onClick={() => fetchResultsData()}>
                    Refresh
                </Button>
            </Flex>
            <Table columns={columns} dataSource={data} />
        </>
    );
}


export default ListResults;
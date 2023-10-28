import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Button, Result, Typography } from 'antd';
const { Paragraph, Text } = Typography;


const SubmissionError = (props) => {
    function resetError() {
        props.resetError()
    }
    return (
        <Result
            status="error"
            title="Submission Failed"
            subTitle="Please check and modify the following information before resubmitting."
            extra={[
                <a href="/" key="home"><Button type="primary">
                    Home
                </Button></a>,
                <Button key="tryAgain" onClick={resetError}>
                    <Link to={props.prevPage} className="nav-text">Try Again</Link>
                </Button>
            ]}
        >
            <div className="desc">
                <Paragraph>
                    <Text
                        strong
                        style={{
                            fontSize: 16,
                        }}
                    >
                        The content you submitted has the following error:
                    </Text>
                </Paragraph>
                {props.err.map((e, i) => {
                    return (
                        <Paragraph key={i.toString()}>
                            <CloseCircleOutlined className="site-result-demo-error-icon" /> {e.toString()}
                        </Paragraph>
                    )
                })}
            </div>
        </Result>
    )
}


export default SubmissionError;
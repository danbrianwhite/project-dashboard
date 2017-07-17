import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {connect} from 'react-redux';

import {recordsRequest, setError} from '../redux/recordActions';

import RecordSummary from './RecordSummary';
import RecordList from './RecordList';
import RecordFloatingFooter from './RecordFloatingFooter';

class Records extends React.Component {
    constructor() {
        super();
        this.state = {};

    }

    componentWillMount() {
        this.props.recordsRequest();
    }

    render() {
        const loading = this.props.loading || !this.props.recordList;

        return (
            <div>
                {
                    loading ?
                        <CircularProgress size={40}/>
                        :
                        <div>
                            <RecordSummary/>
                            <RecordList/>
                            <RecordFloatingFooter/>
                        </div>
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        loading: state.record.loading,
        recordError: state.record.error,
        recordList: state.record.recordList
    }
};

const mapDispatchToProps = {
    recordsRequest,
    setError
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Records);

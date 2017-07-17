import React from 'react';
import {connect} from 'react-redux';

import {recordsRequest, setError} from '../redux/recordActions';
import Record from './Record';

class RecordList extends React.Component {
    constructor() {
        super();
        this.state = {};

    }

    render() {

        let recordListFiltered = this.props.recordList
            .filter(function (record) {
                return record._filterShow
            });

        return (
            <div style={outerStyle}>
                {
                    recordListFiltered.map(function (record) {
                                return <Record key={record._id} data={record}/>
                            }
                        )
                }
                {
                    recordListFiltered.length > 0 ?
                        null:
                        <Record key="noResults" data={{noResults: true}}/>
                }

            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
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
)(RecordList);


const outerStyle = {
    textAlign: 'center',
    paddingBottom: 30,
    zIndex: 1
};
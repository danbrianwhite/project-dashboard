import React from 'react';
import {connect} from 'react-redux';

import RecordResults from './RecordResults';

import IconButton from 'material-ui/IconButton';
import DownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import UpArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-up';

class RecordSummary extends React.Component {
    constructor() {
        super();
        this.state = {open: true};
    }

    toggleHeader = () => {
        this.setState({open: !this.state.open});
    }

    render() {

        const recordList = this.props.recordList;
        const recordListFiltered = this.props.recordList.filter(function (record) {
            return record._filterShow;
        });

        const showFilteredResults = recordListFiltered.length > 0 && recordList.length > recordListFiltered.length;

        return (
            <div style={outerStyle}>
                <div style={headerStyle} onClick={this.toggleHeader}>
                    <h1 style={headerTextStyle}>Records at a Glance</h1>
                    <div style={buttonWrapperStyle}>
                        <IconButton>
                            {this.state.open ? <UpArrow/> : <DownArrow />}
                        </IconButton>
                    </div>
                </div>
                {
                    this.state.open ?
                    <div>
                        <div style={resultsStyle}>
                            <h2 style={titleStyle}>All Results:</h2>
                            <div>
                                <RecordResults recordList={recordList}/>
                            </div>
                        </div>
                        {
                            showFilteredResults ?
                                (
                                    <div style={resultsStyle}>
                                        <h2 style={titleStyle}>This Filter:</h2>
                                        <div>
                                            <RecordResults recordList={recordListFiltered}/>
                                        </div>
                                    </div>
                                )
                                :
                                null
                        }
                    </div>
                    :
                    null
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

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordSummary);


const outerStyle = {
    width: '100%',
    padding: 10,
    zIndex: 1,
    textAlign: 'left',
    background: '#fff',
    color: '#313131',
    border: '2px solid #e0e0e0',
    boxShadow: 'rgba(0, 0, 0, 0.118) 0px 1px 6px, rgba(0, 0, 0, 0.118) 0px 1px 4px',
    borderRadius: 3,
    boxSizing: 'border-box',
    marginBottom: 20
};

const headerStyle = {
    position: 'relative',
    cursor: 'pointer'
};

const headerTextStyle = {
    marginTop: 0,
    marginBottom: 0,
    color: '#232323'
};

const buttonWrapperStyle = {
    position: 'absolute',
    top: -6,
    right: -6
};

const titleStyle = {
    marginTop: '0.3em',
    marginBottom: '0.3em',
    color: '#232323'
};

const resultsStyle = {
    position: 'relative',
    width: '50%',
    display: 'inline-block'
};
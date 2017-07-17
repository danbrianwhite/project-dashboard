/*
 AutoComplete Component

 Wrap MUI AutoComplete component for simpler use of dataSource filtering by key value
 */

import React from 'react';
import AutoCompleteMUI from 'material-ui/AutoComplete';

import {filterRecordValuesByKey} from '../../utils/filter';

class AutoComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            value: this.props.value
        };

        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.handleOpenInput = this.handleOpenInput.bind(this);
        this.handleCloseInput = this.handleCloseInput.bind(this);
    }

    handleUpdateInput(value) {
        let dataList = Object.keys(filterRecordValuesByKey(this.props.recordList, this.props.filterKey))
            .map(function (recordValue) {
                return recordValue;
            });

        this.setState({dataSource: dataList, value: value}, function () {
            if (typeof this.props.onUpdateInput === 'function') {
                this.props.onUpdateInput(value);
            }
        });
    }

    handleOpenInput() {
        let dataList = Object.keys(filterRecordValuesByKey(this.props.recordList, this.props.filterKey))
            .map(function (recordValue) {
                return recordValue;
            });

        this.setState({dataSource: dataList,});
    }

    handleCloseInput() {
        if (typeof this.props.onClose === 'function') {
            this.props.onClose();
        }

        if (typeof this.props.onSave === 'function') {
            const value = this.state.value;
            this.props.onSave(value);
        }
    }

    render() {
        let dataSource = this.state.dataSource;

        let mergeProps = {...this.props};
        delete mergeProps.onSave;
        delete mergeProps.filterKey;
        delete mergeProps.recordList;

        return (
            <AutoCompleteMUI
                filter={AutoCompleteMUI.fuzzyFilter}
                maxSearchResults={5}
                openOnFocus={true}
                {...mergeProps}
                dataSource={dataSource}
                onUpdateInput={this.handleUpdateInput}
                onFocus={this.handleOpenInput}
                onClose={this.handleCloseInput}
            />
        )
    }
}


export default AutoComplete;
import React from 'react';
import {connect} from 'react-redux';
import uuidV4 from 'uuid/v4';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ReactTooltip from "react-tooltip";
import {recordKeysAdd, statusTypes} from '../data/enums';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CurrencyField from '../../../ui/CurrencyField/CurrencyField';
import AutoComplete from '../../../ui/AutoComplete/AutoComplete';


import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import {filterRecordValuesByKey} from '../../../utils/filter';

class RecordAdd extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
        };
        this.tooltipUUIAdd = uuidV4();

        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.renderRecordAddInput = this.renderRecordAddInput.bind(this);
    }

    handleOpen = () => {
        /* clear drawer on open */
        this.state = null;
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleAutoCompleteChangeInput(key, value) {
        this.handleChangeInput(key, value);
    }

    handleTextFieldChangeInput(key, event) {
        this.handleChangeInput(key, event.target.value);
    }

    handleCurrencyFieldChangeInput(key, value, display) {
        this.handleChangeInput(key, value);
    }

    handleSelectFieldChangeInput(key, event, index, value) {
        this.handleChangeInput(key, value);
    }

    handleChangeInput(key, value) {
        let update = {};
        update['value_' + key] = value;
        this.setState(update);
    }

    renderRecordAddInput = (key, recordKey, value) => {

        const text = recordKey.text;
        const type = recordKey.type;

        let inputComponent = null;
        const componentId = 'RecordFilter_' + key;
        const recordList = this.props.recordList;

        if (type === "text") {
            inputComponent = (
                <AutoComplete
                    name={componentId} id={componentId} key={componentId}
                    hintText="Enter Criteria (autocomplete)"
                    fullWidth={true}
                    filterKey={key}
                    recordList={this.props.recordList}
                    onSave={this.handleAutoCompleteChangeInput.bind(this, key)}
                />
            );
        }
        else if (type === "money") {

            const currencyValue = typeof value !== 'undefined' && value !== null ? value: 0;

            inputComponent = <div style={filterItem}>
                    <CurrencyField name={componentId} id={componentId} key={componentId}
                                   value={currencyValue}
                                   onChange={this.handleCurrencyFieldChangeInput.bind(this, key)}
                                   fullWidth={true}
                    />
            </div>
        }
        else if (type === "status") {
            inputComponent = (
                <SelectField
                    hintText={'Select ' + text}
                    fullWidth={true}
                    value={this.state['value_' + key]}
                    onChange={this.handleSelectFieldChangeInput.bind(this, key)}
                >
                    {Object.keys(filterRecordValuesByKey(recordList, key)).map(function (statusValue) {
                        return <MenuItem key={statusValue} value={statusValue}
                                         primaryText={statusTypes[statusValue].text}/>
                    })}
                </SelectField>
            );
        }
        else if (type === "group") {
            inputComponent = (
                <SelectField
                    hintText={'Select ' + text}
                    fullWidth={true}
                    value={this.state['value_' + key]}
                    onChange={this.handleSelectFieldChangeInput.bind(this, key)}
                >
                    {Object.keys(filterRecordValuesByKey(recordList, key)).map(function (recordValue) {
                        return <MenuItem key={recordValue} value={recordValue} primaryText={recordValue}/>
                    })}
                </SelectField>
            );
        }
        else {
            inputComponent = <TextField
                name={componentId} id={componentId} key={componentId}
                value={this.state['value_' + key]}
                onChange={this.handleTextFieldChangeInput.bind(this, key)}
                fullWidth={true}
                hintText="Enter Criteria"
            />
        }

        return (
            <div key={key}>
                <div style={filterLabelStyle}>{text}</div>
                <div style={filterInputStyle}>{inputComponent}</div>
            </div>
        );
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                style={{marginRight: 5}}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Add"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleClose}
            />,
        ];

        const renderRecordAddInput = this.renderRecordAddInput;
        const that = this;

        return (
            <div>
                <ReactTooltip id={this.tooltipUUIAdd} effect="solid" place="top">
                    <span>Add Record</span>
                </ReactTooltip>
                <FloatingActionButton
                    data-tip data-for={this.tooltipUUIAdd}
                    onTouchTap={this.handleOpen}
                >
                    <ContentAdd />
                </FloatingActionButton>
                <Dialog
                    title={<AppBar
                        title={<span>Add Record</span>}
                        iconElementRight={<IconButton onTouchTap={this.handleClose}><NavigationClose /></IconButton>}
                        iconElementLeft={<div></div>}
                        style={headerStyle}
                    />}
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                >
                    <div style={outerStyle}>
                    {
                        Object.keys(recordKeysAdd).map(function (key) {
                            const value = that.state['value_' + key];

                            return renderRecordAddInput(key, recordKeysAdd[key], value)
                        })
                    }
                    </div>
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        recordList: state.record.recordList
    }
};

const mapDispatchToProps = {

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordAdd);


const outerStyle = {
    paddingTop: 15
};

const headerStyle = {
    paddingTop: 0,
    paddingBottom: 0
};

const filterItem = {
    zIndex: 1,
    position: 'relative'
};

const filterLabelStyle = {
    width: '100%',
    display: 'inline-block'
};

const filterInputStyle = {
    width: '100%',
    display: 'inline-block'
};

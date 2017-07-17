import React from 'react';
import {connect} from 'react-redux';

import {recordKeys, statusTypes} from '../data/enums';

import {recordsRequest, recordSave} from '../redux/recordActions';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import ActionDone from 'material-ui/svg-icons/action/done';
import {green500} from 'material-ui/styles/colors';

import DelayFadeOut from '../../../ui/Animation/DelayFadeOut';
import CircularProgress from 'material-ui/CircularProgress';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from '../../../ui/AutoComplete/AutoComplete';
import CurrencyField from '../../../ui/CurrencyField/CurrencyField';

class Record extends React.Component {
    constructor() {
        super();
        this.state = {};

        this.filterRecordValuesByKey = this.filterRecordValuesByKey.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.renderRecordInput = this.renderRecordInput.bind(this);
    }

    filterRecordValuesByKey(key) {
        let values = {};
        this.props.recordList.forEach(function (record) {
            let value = record[key];
            if (typeof value === 'string') {
                value = value.trim();
                if (value) {
                    values[value] = value;
                }
            }
            else if (typeof value === 'number') {
                values[value] = value;
            }

        });

        return values;
    }

    handleAutoCompleteChangeInput(id, key, value) {
        this.handleChangeInput(id, key, value);
    }

    handleCurrencyFieldChangeInput(id, key, value, display) {
        this.handleChangeInput(id, key, value);
    }

    handleSelectFieldChangeInput(id, key, event, index, value) {
        this.handleChangeInput(id, key, value);
    }

    handleChangeInput(id, key, value) {
        /* latency compensation by showing value now before save finished */
        let update = {};
        update['value_' + key] = value;

        const recordList = this.props.recordList;
        let currentRecord = Object.keys(recordList).map(function (key) {
            return recordList[key];
        }).filter(function (record) {
            return record._id === id;
        });

        currentRecord = currentRecord.length > 0 ? currentRecord[0] : null;

        if (currentRecord[key] !== value) {
            this.setState(update, function () {
                this.props.recordSave(id, key, value);
            });
        }


    }

    renderRecordInput(id, key, recordKey, value, saving) {
        const disabled = saving;

        const type = recordKey.type;

        let inputComponent = null;
        const componentId = 'Record_' + key + '_' + id;

        if (type === "text") {
            inputComponent =
                <TextField name={componentId} id={componentId} key={componentId}
                           style={inputStyle}
                           textFieldStyle={textStyle}
                           fullWidth={true}
                           value={value}
                           disabled={disabled}
                />
        }
        else if (type === "money") {
            inputComponent = <CurrencyField name={componentId} id={componentId} key={componentId}
                                            style={inputStyle}
                                            inputStyle={textStyle}
                                            fullWidth={true}
                                            value={value}
                                            onSave={this.handleCurrencyFieldChangeInput.bind(this, id, key)}
                                            disabled={disabled}
            />
        }
        else if (type === "status") {
            inputComponent = (
                <SelectField
                    name={componentId} id={componentId} key={componentId}
                    value={value}
                    style={inputStyle}
                    labelStyle={textStyle}
                    fullWidth={true}
                    onChange={this.handleSelectFieldChangeInput.bind(this, id, key)}
                    disabled={disabled}
                >
                    {Object.keys(this.filterRecordValuesByKey(key)).map(function (statusValue) {
                        return <MenuItem key={statusValue} value={statusValue}
                                         primaryText={statusTypes[statusValue].text}/>
                    })}
                </SelectField>
            );
        }
        else if (type === "group") {
            inputComponent = (
                <AutoComplete
                    name={componentId} id={componentId} key={componentId}
                    style={inputStyle}
                    inputStyle={textStyle}
                    fullWidth={true}
                    value={value}
                    searchText={value}
                    filterKey={key}
                    recordList={this.props.recordList}
                    onSave={this.handleAutoCompleteChangeInput.bind(this, id, key)}
                    disabled={disabled}
                />
            );
        }
        else if (type === "date") {
            /*  inputComponent = <div>
             <div>{text}</div>
             <DatePicker floatingLabelText="Min" mode="landscape"/>
             <DatePicker floatingLabelText="Max" mode="landscape"/>
             </div>*/
        }
        else {
            //  inputComponent = <TextField floatingLabelText={text}/>
        }


        return (
            <div key={key}>
                {inputComponent}
            </div>
        );
    }

    renderAdvancedMenu() {
        return (
            <div style={advancedOptionsMenuOuterStyle}>
                <IconMenu
                    iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                    <MenuItem primaryText="Advanced Options"/>
                </IconMenu>
            </div>
        );
    }

    renderSaving() {
        return (
            <div style={savingOuterStyle}>
                <CircularProgress size={28} thickness={3}/>
            </div>
        )
    }

    renderSaveComplete() {
        return (
            <DelayFadeOut style={saveCompleteOuterStyle}>
                <ActionDone style={{}} color={green500}/>
            </DelayFadeOut>
        )
    }

    render() {
        let that = this;
        return (
            <div style={outerStyle}>
                {
                    this.props.data.noResults ?
                        <div style={noResultsStyle}>
                            <div>
                                No Results for the current filter. Update the filter to see more results.
                            </div>
                        </div>
                        :
                        <div>
                            {this.renderAdvancedMenu()}
                            {
                                Object.keys(recordKeys).map(function (key) {
                                    const recordKey = recordKeys[key];
                                    const record = that.props.data;

                                    const id = record._id;
                                    const recordData = that.props.saveRecordData[key];
                                    const saving = recordData ? recordData.saving : null;
                                    const saveComplete = !saving && (recordData ? recordData.complete : null);

                                    //const value = saving ? that.state['value_' + key] : (record[key] ? record[key] : recordKey.valueEmpty);
                                    const value = saving ? that.state['value_' + key] : (record[key] ? record[key] : recordKey.valueEmpty);

                                    const recordField = recordKey.editable ? that.renderRecordInput(id, key, recordKey, value, saving) : value;
                                    const mergedRightCellStyle = {...rightCell, ...(recordKey.editable ? {} : textCell)};
                                    return <div key={key} style={row}>
                                        <div style={leftCell}>{recordKey.text}:</div>
                                        <div style={mergedRightCellStyle}>
                                            {recordField}
                                            {saving ? that.renderSaving() : null}
                                            {saveComplete ? that.renderSaveComplete() : null}
                                        </div>
                                    </div>;

                                })
                            }
                        </div>
                }
            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        recordList: state.record.recordList,
        saveRecordData: state.record.saveRecordMap[ownProps.data._id] ? state.record.saveRecordMap[ownProps.data._id] : {}
    }
};

const mapDispatchToProps = {
    recordsRequest,
    recordSave
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Record);

const outerStyle = {
    display: 'inline-block',
    position: 'relative',
    margin: 7,
    paddingTop: 25,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    width: 355,
    height: 315,
    background: '#fff',
    color: '#505050',
    border: '2px solid #e0e0e0',
    borderRadius: 10,
    textAlign: 'left',
    boxSizing: 'border-box',
    boxShadow: 'rgba(0, 0, 0, 0.118) 0px 1px 6px, rgba(0, 0, 0, 0.118) 0px 1px 4px',
};

const row = {
    width: '100%',
    maxHeight: 36
};

const textCell = {
    lineHeight: '50px'
};

const cellShared = {
    display: 'inline-block',
    marginTop: -4
};

const leftCell = {
    ...cellShared,
    width: 130,
    paddingRight: 10,
    textAlign: 'right',
    lineHeight: '50px',
    verticalAlign: 'top',
    boxSizing: 'border-box'
};

const textStyle = {
    color: '#383838'
};

const rightCell = {
    ...cellShared,
    color: '#5d5c5c',
    position: 'relative',
    width: 'calc(100% - ' + leftCell.width + 'px)'
};

const inputStyle = {};


const savingOuterStyle = {
    position: 'absolute',
    top: 7,
    right: 5
};

const saveCompleteOuterStyle = {
    position: 'absolute',
    top: 11,
    right: 5
};

const advancedOptionsMenuOuterStyle = {
    position: 'absolute',
    top: 0,
    right: 0
};

const noResultsStyle = {
    height: '100%',
    position: 'relative',
    top: -8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};
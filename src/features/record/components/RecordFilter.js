import React from 'react';
import {connect} from 'react-redux';

import {recordsRequest, setError, toggleFilter, setFilter} from '../redux/recordActions';
import {recordKeys, statusTypes} from '../data/enums';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import CurrencyField from '../../../ui/CurrencyField/CurrencyField';
import AutoComplete from '../../../ui/AutoComplete/AutoComplete';

import Toggle from 'material-ui/Toggle';

import {filterRecordValuesByKey, getMinimumMaximumCurrency, getMinimumMaximumDate} from '../../../utils/filter';

let styleInjected = false;

const injectStyle = function () {
    if (!styleInjected) {
        styleInjected = !!document.getElementById('inputCentered');
        if (!styleInjected) {

            const style = document.createElement('style');
            style.id = 'inputCentered';
            style.innerHTML = `
                .inputCentered input {
                    text-align: center;
                }
            `;

            document.body.appendChild(style);
            styleInjected = true;
        }
    }
};


class RecordFilter extends React.Component {
    constructor() {
        super();
        this.state = {};

        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.renderFilterInput = this.renderFilterInput.bind(this);
    }

    componentDidMount() {
        injectStyle();
    }

    formatDate(date) {
        let month = (date.getMonth() + 1).toString();
        month = month.length === 1 ? '0' + month : month;
        let day = (date.getDate()).toString();
        day = day.length === 1 ? '0' + day : day;
        const year = date.getFullYear();

        return month + "/" + day + "/" + year;
    }

    handleToggleFilter(key, event, value) {
        this.props.toggleFilter(key, value);
    }

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

    handleDatePickerChangeInput(key, event, date) {
        this.handleChangeInput(key, date);
    }

    handleChangeInput(key, value) {
        let update = {};
        update['value_' + key] = value;
        this.setState(update, function(){
            this.props.setFilter(key, value);
        });
    }

    renderFilterInput(key, recordKey) {

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

            let minState = this.state['value_' + key + '|min'];
            let maxState = this.state['value_' + key + '|max'];

            let {minimum, maximum} = getMinimumMaximumCurrency(recordList, key, minState, maxState);

            inputComponent = <div style={filterItem}>
                <div style={sideBySideInputStyle}>
                    <CurrencyField name={componentId + "|min"} id={componentId + "|min"} key={componentId + "|min"}
                                   className="inputCentered"
                                   value={minimum}
                                   onChange={this.handleCurrencyFieldChangeInput.bind(this, key + '|min')}
                                   fullWidth={true}
                    />
                </div>
                <div style={separatorStyle}>-</div>
                <div style={sideBySideInputStyle}>
                    <CurrencyField name={componentId + "|max"} id={componentId + "|max"} key={componentId + "|max"}
                                   className="inputCentered"
                                   value={maximum}
                                   onChange={this.handleCurrencyFieldChangeInput.bind(this, key + '|max')}
                                   fullWidth={true}
                    />
                </div>
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
        else if (type === "date") {
            let minState = this.state['value_' + key + '|min'];
            let maxState = this.state['value_' + key + '|max'];

            let {minimum, maximum} = getMinimumMaximumDate(recordList, key, minState, maxState);

            inputComponent = <div>
                <div style={sideBySideInputStyle}>
                    <DatePicker
                        className="inputCentered"
                        value={minimum}
                        formatDate={this.formatDate}
                        onChange={this.handleDatePickerChangeInput.bind(this, key + '|min')}
                        fullWidth={true}
                        hintText="Pick Date" name={key + 'min'} id={key + 'min'} key={key + 'min'}
                        mode="landscape"/>
                </div>
                <div style={separatorStyle}>-</div>
                <div style={sideBySideInputStyle}>
                    <DatePicker
                        className="inputCentered"
                        value={maximum}
                        formatDate={this.formatDate}
                        onChange={this.handleDatePickerChangeInput.bind(this, key + '|max')}
                        fullWidth={true}
                        hintText="Pick Date" name={key + 'max'} id={key + 'max'} key={key + 'max'}
                        mode="landscape"/>
                </div>
            </div>
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

        const showFilter = this.props.filterToggleMap[key];

        return (
            <div key={key}>
                <div style={filterLabelStyle}>
                    <Toggle
                        label={<h4 style={titleStyle}>{text}</h4>}
                        onToggle={this.handleToggleFilter.bind(this, key)}
                    />
                </div>
                <div style={showFilter ? filterInputStyle : filterInputStyleHidden}>{inputComponent}</div>
            </div>
        );
    }

    render() {

        const renderFilterInput = this.renderFilterInput;

        return (
            <div style={outerStyle}>
                {
                    Object.keys(recordKeys).map(function (key) {
                        return renderFilterInput(key, recordKeys[key])
                    })
                }

            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        recordList: state.record.recordList,
        filterToggleMap: state.record.filterToggleMap,
        filterMap: state.record.filterMap
    }
};

const mapDispatchToProps = {
    recordsRequest,
    setError,
    toggleFilter,
    setFilter
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordFilter);

const outerStyle = {
    width: '100%',
    borderRadius: 3,
    padding: 10,
    boxSizing: 'border-box',
    zIndex: 1,
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

const filterInputStyleHidden = {
    display: 'none'
};


const separatorStyle = {
    width: 16,
    display: 'inline-block',
    textAlign: 'center'
};

const sideBySideInputStyle = {
    width: 'calc(50% - ' + separatorStyle.width / 2 + 'px)',
    display: 'inline-block'
};

const titleStyle = {
    margin: 0,
    color: '#232323'
};
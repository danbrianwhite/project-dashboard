/*
 CurrencyField Component

 Component wraps Material-UI TextField to utilize Material-UI styling and functionality
 and implements a layer of data input filtering and formatting focusing on keeping the cursor
 in the correct place when editing USD
 */

import React from 'react';
import TextField from 'material-ui/TextField';

const formatCurrency = function (value, noFix) {

    value = value.toString();

    if (!noFix) {
        let decimals = value.split('.');
        if (decimals.length > 1) {
            if (decimals[1].length === 1) {
                value = value + '0';
            }
            else if (decimals[1].length === 0) {
                value = value + '00';
            }
            else if (decimals[1].length > 2) {
                value = value.slice(0, value.length - (decimals[1].length - 2))
            }

        }
        else {
            value = value + '.00';
        }
    }

    value = value.replace(/[^0-9]/g, '');

    if (value === "") {
        value = 0;
    }
    else {
        value = parseInt(value, 10);
    }

    value = value.toString();

    const minimumDigits = 3;
    const digitsAdd = minimumDigits - value.length;

    for (let i = 0; i < digitsAdd; i++) {
        value = "0" + value;
    }

    let integer = parseInt(value.slice(0, value.length - 2), 10);
    let commaString = integer.toLocaleString('en-US');
    let decimal = value.slice(value.length - 2, value.length);

    value = (integer + '.' + decimal);
    let display = "$" + commaString + '.' + decimal;

    return {
        value: value,
        display: display
    };
};

export {formatCurrency}

class CurrencyField extends React.Component {
    constructor(props) {
        super(props);

        const value = this.props.onChange ? null : this.props.value;
        const display = this.props.onChange ? null : formatCurrency(this.props.value, true).display;

        this.state = {
            value: value,
            display: display
        };

        this.handleCurrencyFieldKeyDown = this.handleCurrencyFieldKeyDown.bind(this);
        this.handleCurrencyFieldKeyPress = this.handleCurrencyFieldKeyPress.bind(this);
        this.handleCurrencyFieldChangeInput = this.handleCurrencyFieldChangeInput.bind(this);
        this.handleCurrencyFieldSaveInput = this.handleCurrencyFieldSaveInput.bind(this);

        /*
         references for input data and caret position added here
         instead of state for JS and UI performance reasons
         */
        this.input = null;
        this.inputValue = '';
        this.caretPosition = null;
        this.keyCode = null;
    }

    componentWillReceiveProps() {
        this.inputValue = this.input !== null && this.input.value ? this.input.value : '';
    }

    componentDidUpdate(nextProps, nextState) {
        if (this.input && this.caretPosition) {
            if (this.props.value !== nextProps.value || (!this.props.onChange && this.state.value !== nextState.value)) {
                this.setCaretPosition(this.input, this.caretPosition);
            }
            else if (this.input !== null && this.inputValue.indexOf('$') === -1) {
                this.setCaretPosition(this.input, 1);
            }
        }
    }

    setCaretPosition(input, position) {
        input.setSelectionRange(position, position);
    }

    handleCurrencyFieldKeyDown(event) {
        this.keyCode = event.key;
    }

    handleCurrencyFieldKeyPress(event) {
        const keyCode = event.key;
        let value = event.target.value;
        value = value.replace(/[^0-9]/g, '');

        if (/[^0-9]/.test(keyCode) || value.length >= 15) {
            event.preventDefault();
        }

        if (typeof this.props.onKeyPress === 'function') {
            this.props.onKeyPress(event);
        }
    }

    handleCurrencyFieldChangeInput(event, fieldValue) {
        this.input = event.target;
        this.caretPosition = this.input.selectionStart;

        const lastValue = (typeof this.props.value !== 'undefined' && this.props.onChange) ? formatCurrency(this.props.value, true).display : this.state.display;

        /* update based on user deleting at period or comma */
        let tempFieldValueArray = fieldValue.replace(/[^0-9,.]/g, '').replace('.', ',').split(',');
        let tempDecimal = tempFieldValueArray.pop();

        if (fieldValue.length < lastValue.length) {
            const keyCode = this.keyCode;
            let that = this;
            if (tempDecimal.length !== 2) {
                if (tempDecimal.length > 2 && keyCode === "Delete") {
                    tempFieldValueArray.push(tempDecimal.slice(0, tempDecimal.length - 2));
                    tempDecimal = tempDecimal.slice(tempDecimal.length - 1, tempDecimal.length);
                    that.caretPosition += 1;
                }
                else {
                    tempFieldValueArray.push(tempDecimal.slice(0, tempDecimal.length - 3));
                    tempDecimal = tempDecimal.slice(tempDecimal.length - 2, tempDecimal.length);
                }

            }
            else {
                tempFieldValueArray.forEach(function (tempFieldValue, index) {
                    if (tempFieldValue.length > 3) {
                        let beforeDelete = null;
                        let afterDelete = null;

                        if (keyCode === "Delete") {
                            beforeDelete = tempFieldValue.slice(0, tempFieldValue.length - 3);
                            afterDelete = tempFieldValue.slice(tempFieldValue.length - 2, tempFieldValue.length);
                            that.caretPosition += 1;
                        }
                        else {
                            beforeDelete = tempFieldValue.slice(0, tempFieldValue.length - 4);
                            afterDelete = tempFieldValue.slice(tempFieldValue.length - 3, tempFieldValue.length);
                        }

                        tempFieldValueArray[index] = beforeDelete + afterDelete;
                    }
                })
            }
        }

        let tempFieldValue = tempFieldValueArray.join('') + '.' + tempDecimal;
        let {value, display} = formatCurrency(tempFieldValue, true);
        let formattedFieldValue = formatCurrency(parseFloat(fieldValue.replace(/[^0-9,.]/g, '', true).replace(/,/g, ''))).display;
        const countSeparators = display.split(',').length - formattedFieldValue.split(',').length;

        if (countSeparators !== 0) {
            let addToPosition = null;
            if (countSeparators === 1) {
                addToPosition = 1;
            }
            else if (countSeparators === -1) {
                addToPosition = -1;
            }
            else {
                this.caretPosition = this.caretPosition - display.length
            }
            this.caretPosition += addToPosition;
            this.setCaretPosition(this.input, this.caretPosition);
        }
        else if (display.length < fieldValue.length) {
            this.caretPosition += -1;
            this.setCaretPosition(this.input, this.caretPosition);
        }
        else if (display.length > fieldValue.length) {
            if (fieldValue.split('.')[0] !== '$') {
                this.caretPosition += 1;
                this.setCaretPosition(this.input, this.caretPosition);
            }
        }

        this.setState({value: value, display: display}, function () {
            if (typeof this.props.onChange === 'function') {
                this.props.onChange(value, display);
            }
        });
    }

    handleCurrencyFieldSaveInput() {
        if (typeof this.props.onSave === 'function') {
            const {value, display} = this.state;
            this.props.onSave(value, display);
        }
    }

    render() {
        const value = (typeof this.props.value !== 'undefined' && this.props.onChange) ? formatCurrency(this.props.value, true).display : this.state.display;
        let mergeProps = {...this.props};
        delete mergeProps.onSave;

        return (
            <TextField
                {...mergeProps}
                value={value}
                onKeyPress={this.handleCurrencyFieldKeyPress}
                onKeyDown={this.handleCurrencyFieldKeyDown}
                onChange={this.handleCurrencyFieldChangeInput}
                onBlur={this.handleCurrencyFieldSaveInput}
            />
        )
    }
}


export default CurrencyField;

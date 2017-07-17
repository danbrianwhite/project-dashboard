import React from 'react';
import {BigNumber} from 'bignumber.js';
import {formatCurrency} from '../../../ui/CurrencyField/CurrencyField';
import {statusTypes} from '../data/enums';

const calculateTotal = function (list) {
    let total = new BigNumber(0);

    list.map(function (record) {
        return record.budget ? record.budget : 0;
    })
        .forEach(function (value) {
            let bigValue = new BigNumber(value);
            total = total.add(bigValue);
        });

    total = formatCurrency(total.toString()).display;
    return total;
};

class RecordResults extends React.Component {
    constructor() {
        super();
        this.state = {};

    }

    totalBudget = () => {

        let total = calculateTotal(this.props.recordList);

        return (
            <div>
                <h3 style={titleStyle}>Total Budget</h3>
                <div>{total}</div>
            </div>
        );
    }

    budgetRange = () => {

        let minimum = null;
        let maximum = null;

        this.props.recordList
            .map(function (record) {
                return record.budget ? record.budget : 0;
            })
            .forEach(function (value) {

                if (!minimum) {
                    minimum = value;
                }

                if (!maximum) {
                    maximum = value;
                }

                if (value < minimum) {
                    minimum = value
                }
                else if (value > maximum) {
                    maximum = value;
                }
            });

        const minFormatted = formatCurrency(minimum).display;
        const maxFormatted = formatCurrency(maximum).display;

        return (
            <div>
                <h3 style={titleStyle}>Budget Range</h3>
                <div>{minFormatted} - {maxFormatted}</div>
            </div>
        );
    }

    statusGroups = () => {

        let statusMap = {};

        this.props.recordList
            .map(function (record) {
                return {status: record.status, budget: record.budget}
            })
            .forEach(function (record) {
                const {status, budget} = record;
                if (!statusMap[status]) {
                    statusMap[status] = {count: 1, budgetList: [{budget: budget}]};
                }
                else {
                    statusMap[status].count += 1;
                    statusMap[status].budgetList.push({budget: budget});
                }
            });

        return (
            <div>
                <h3 style={{...titleStyle, marginTop: '0.6em'}}>Projects by Status</h3>
                <div>{
                    statusMap && Object.keys(statusMap).length > 0 ?
                        Object.keys(statusTypes).map(function (key) {
                            if (statusMap[key]) {
                                const text = statusTypes[key].text;
                                const {count, budgetList} = statusMap[key];
                                const total = calculateTotal(budgetList);
                                return <div style={statusItem} key={key}>
                                    <h4 style={statusTypeStyle}>{text}:</h4>
                                    <div style={statusCountStyle}>{count} totaling {total}</div>
                                </div>;
                            } else {
                                return null;
                            }

                        })
                        :
                        null
                }
                </div>
            </div>
        );
    }


    render() {
        return (
            <div style={outerStyle}>
                {this.totalBudget()}
                {this.budgetRange()}
                {this.statusGroups()}
            </div>
        )
    }
}

export default RecordResults;

const outerStyle = {
    textAlign: 'left',
    paddingBottom: 30,
    zIndex: 1,
};

const titleStyle = {
    marginTop: '0.3em',
    marginBottom: '0.3em',
    color: '#232323'
};

const statusItem = {
    paddingBottom: 10,
    display: 'inline-block'
};

const statusTypeStyle = {
    ...titleStyle,
    display: 'block',
    width: 100,
    marginRight: 5,
    textAlign: 'left',
    verticalAlign: 'top'
};

const statusCountStyle = {
    width: 100,
    display: 'block',
    textAlign: 'left'
};

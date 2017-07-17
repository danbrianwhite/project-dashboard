const filterRecordValuesByKey = function(list, key) {
    let values = {};
    list.forEach(function (record) {
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
};

export {filterRecordValuesByKey};


const getMinimumMaximumCurrency = function(recordList, key, minimum, maximum){
    if (typeof minimum === 'undefined') {
        Object.keys(filterRecordValuesByKey(recordList, key)).forEach(function (value) {

            const numberValue = parseFloat(value);

            if (!minimum) {
                minimum = numberValue;
            }

            if (numberValue < minimum) {
                minimum = numberValue;
            }
        });
    }

    if (typeof maximum === 'undefined') {
        Object.keys(filterRecordValuesByKey(recordList, key)).forEach(function (value) {

            const numberValue = parseFloat(value);

            if (!maximum) {
                maximum = numberValue;
            }

            if (numberValue > maximum) {
                maximum = numberValue;
            }
        });
    }


    if (typeof minimum === 'undefined') {
        minimum = 0;
    }

    if (typeof maximum === 'undefined') {
        maximum = minimum;
    }

    return {minimum: minimum, maximum: maximum}
};

export {getMinimumMaximumCurrency}


const getMinimumMaximumDate = function(recordList, key, minimum, maximum){
    if (!minimum) {
        Object.keys(filterRecordValuesByKey(recordList, key)).forEach(function (value) {
            const dateValue = new Date(value);

            if (!minimum) {
                minimum = dateValue;
            }

            if (dateValue < minimum) {
                minimum = dateValue;
            }
        });

        if (!minimum) {
            minimum = new Date();
        }
    }

    if (!maximum) {
        Object.keys(filterRecordValuesByKey(recordList, key)).forEach(function (value) {
            const dateValue = new Date(value);

            if (!maximum) {
                maximum = dateValue;
            }

            if (dateValue > maximum) {
                maximum = dateValue;
            }
        });

        if (!maximum) {
            maximum = minimum;
        }
    }

    return {minimum: minimum, maximum: maximum}
};

export {getMinimumMaximumDate}


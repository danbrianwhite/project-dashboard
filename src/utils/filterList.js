import {recordKeys} from '../features/record/data/enums';
import {getMinimumMaximumCurrency, getMinimumMaximumDate} from './filter';

const setFilterShow = function (array, filterToggleList, filterList) {

    const filterListMap = {};
    for (let flm = 0; flm < filterList.length; flm++) {
        const filterListItem = filterList[flm];

        if (filterListItem.subKey) {
            if (!filterListMap[filterListItem.key]) {
                filterListMap[filterListItem.key] = {};
            }
            filterListMap[filterListItem.key][filterListItem.subKey] = filterListItem.value;
        }
        else {
            filterListMap[filterListItem.key] = filterListItem.value;
        }

    }

    for (let i = 0; i < array.length; i++) {
        let record = array[i];

        let show = true;
        for (let t = 0; t < filterToggleList.length; t++) {
            let toggleKey = filterToggleList[t];
            const recordKey = recordKeys[toggleKey];
            const type = recordKey.type;
            const filterListMapItem = filterListMap[toggleKey];
            const recordItem = record[toggleKey];
            if (filterListMapItem) {

                if (type === "text") {
                    if (recordItem.toLowerCase().indexOf(filterListMapItem.toLowerCase()) === -1) {
                        show = false;
                        break;
                    }
                }
                else if (type === "group") {
                    if (recordItem !== filterListMapItem) {
                        show = false;
                        break;
                    }
                }
                else if (type === "money") {

                    const {minimum, maximum} = getMinimumMaximumCurrency(array, toggleKey, filterListMapItem.min, filterListMapItem.max);
                    const min = parseFloat(minimum < maximum ? minimum : maximum);
                    const max = parseFloat(maximum > minimum ? maximum : minimum);

                    if (!(min <= recordItem && recordItem <= max)) {
                        show = false;
                        break;
                    }
                }
                else if (type === "status") {
                    if (recordItem !== filterListMapItem) {
                        show = false;
                        break;
                    }
                }
                else if (type === "date") {
                    const {minimum, maximum} = getMinimumMaximumDate(array, toggleKey, filterListMapItem.min, filterListMapItem.max);
                    const min = minimum < maximum ? minimum : maximum;
                    const max = maximum > minimum ? maximum : minimum;
                    const recordItemDate = new Date(recordItem);

                    if (!(min <= recordItemDate && recordItemDate <= max)) {
                        show = false;
                        break;
                    }
                }
                else {

                }

            }
        }


        array[i]._filterShow = show;


    }
    return array;
};

const filterList = function (array, filterToggleMap, filterMap) {

    /* sanitize filterToggleMap */
    const filterToggleList = Object.keys(filterToggleMap).filter(function (filterToggle) {
        return filterToggleMap[filterToggle] === true;
    });

    /* sanitize filterMap */
    const filterList = Object.keys(filterMap).filter(function (filterKey) {

        const key = filterKey.split('|')[0];


        let validData = true;
        const value = filterMap[filterKey];

        const recordKey = recordKeys[key];

        if (typeof value === 'undefined' || value === null) {
            validData = false;
        }
        else if (recordKey.type === "text") {
            if (value === "") {
                validData = false;
            }
        }

        return validData === true;
    }).map(function (filterKey) {
        const keySplit = filterKey.split('|');
        const key = keySplit[0];
        let subKey = null;

        if (keySplit.length > 1) {
            subKey = keySplit[1];
        }

        return {
            key: key,
            subKey: subKey,
            value: filterMap[filterKey]
        };
    });

    if (filterToggleList.length === 0 || filterList.length === 0) {
        for (let i = 0; i < array.length; i++) {
            array[i]._filterShow = true;
        }
    }
    else {
        array = setFilterShow(array, filterToggleList, filterList);
    }

    return array;
};


export default filterList;




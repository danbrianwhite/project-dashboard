import clone from 'clone';
import filterList from '../../../utils/filterList';

import {
    RECORDS_LOADING,
    SET_ERROR,
    SET_RECORDS_DATA,
    SET_RECORD_SAVING_DATA,
    SET_RECORD_SAVE_ERROR,
    SET_RECORD_DATA,
    TOGGLE_FILTER,
    SET_FILTER
} from './recordActions';

const initialState = {
    loading: false,
    error: null,
    recordList: null,
    saveRecordMap: {},
    filterToggleMap: {},
    filterMap: {}
};

const recordReducer = function (state = initialState, action) {
    switch (action.type) {

        case RECORDS_LOADING: {
            return Object.assign({}, state, {
                loading: action.loading
            });
        }

        case SET_ERROR: {
            return Object.assign({}, state, {
                error: action.error
            });
        }

        case SET_RECORDS_DATA: {

            /* adding id for potential performance improvements when filtering etc. */
            action.records = action.records.map(function (record, index) {
                record._id = index;
                return record;
            });

            let recordListFiltered = filterList(action.records, state.filterToggleMap, state.filterMap);

            return Object.assign({}, state, {
                recordList: recordListFiltered
            });
        }

        case SET_RECORD_SAVING_DATA: {
            let stateClone = clone(state);
            if (!stateClone.saveRecordMap[action.id]) {
                stateClone.saveRecordMap[action.id] = {};
            }
            stateClone.saveRecordMap[action.id][action.key] = {
                ...stateClone.saveRecordMap[action.id][action.key],
                saving: action.saving
            };

            return stateClone;
        }

        case SET_RECORD_SAVE_ERROR: {
            let stateClone = clone(state);
            if (!stateClone.saveRecordMap[action.id]) {
                stateClone.saveRecordMap[action.id] = {};
            }
            stateClone.saveRecordMap[action.id][action.key] = {
                ...stateClone.saveRecordMap[action.id][action.key],
                error: action.error,
                complete: false
            };

            return stateClone;
        }

        case SET_RECORD_DATA: {

            const update = action.update;

            let stateClone = clone(state);
            if (!stateClone.saveRecordMap[action.id]) {
                stateClone.saveRecordMap[action.id] = {};
            }
            stateClone.saveRecordMap[action.id][action.key] = {
                ...stateClone.saveRecordMap[action.id][action.key],
                error: '',
                complete: true
            };

            stateClone.recordList[action.id][action.key] = update.value;
            stateClone.recordList[action.id].modified = update.lastModifiedDate;

            let recordListFiltered = filterList(stateClone.recordList, stateClone.filterToggleMap, stateClone.filterMap);
            stateClone.recordList = recordListFiltered;

            return stateClone;
        }

        case TOGGLE_FILTER: {
            const {filter, value} = action;
            let stateClone = clone(state);
            stateClone.filterToggleMap[filter] = value;

            let recordListFiltered = filterList(stateClone.recordList, stateClone.filterToggleMap, stateClone.filterMap);
            stateClone.recordList = recordListFiltered;

            return stateClone;
        }

        case SET_FILTER: {
            const {filter, value} = action;
            let stateClone = clone(state);
            stateClone.filterMap[filter] = value;

            let recordListFiltered = filterList(stateClone.recordList, stateClone.filterToggleMap, stateClone.filterMap);
            stateClone.recordList = recordListFiltered;

            return stateClone;
        }


        default: {
            return state
        }

    }
};

export {recordReducer};

import {mockFetch} from './mockFetch';
import {batchActions} from 'redux-batched-actions';

export const RECORDS_LOADING = 'recordActions/RECORDS_LOADING';
export const RECORDS_SUCCESS = 'recordActions/RECORDS_SUCCESS';
export const RECORDS_ERROR = 'recordActions/RECORDS_ERROR';
export const SET_ERROR = 'recordActions/SET_ERROR';
export const SET_RECORDS_DATA = 'recordActions/SET_RECORDS_DATA';

export const SET_RECORD_SAVING_DATA = 'recordActions/SET_RECORD_SAVING_DATA';
export const SAVE_RECORD_SUCCESS = 'recordActions/SAVE_RECORD_SUCCESS';
export const SAVE_RECORD_ERROR = 'recordActions/SAVE_RECORD_ERROR';
export const SET_RECORD_SAVE_ERROR = 'recordActions/SET_RECORD_SAVE_ERROR';
export const SET_RECORD_DATA = 'recordActions/SET_RECORD_DATA';

export const TOGGLE_FILTER = 'recordActions/TOGGLE_FILTER';
export const SET_FILTER = 'recordActions/SET_FILTER';

function fetchRecords() {
    return fetch('/records.json', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'GET',
        credentials: 'include'
    });
}

function recordsLoading(loading) {
    return {
        type: RECORDS_LOADING,
        loading
    };
}

function setError(error) {
    return {
        type: SET_ERROR,
        error
    };
}

export {setError};


function setRecords(records) {
    return {
        type: SET_RECORDS_DATA,
        records
    };
}

function recordsRequest() {
    return function (dispatch) {
        dispatch(recordsLoading(true));

        const recordError = function (error) {
            dispatch(batchActions([
                setError(error),
                recordsLoading(false)
            ], RECORDS_ERROR));
        };

        return fetchRecords().then(
            response => {
                const contentType = response.headers.get("content-type");
                if (response.ok && contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json().then(function (records) {
                        dispatch(batchActions([
                            setRecords(records),
                            recordsLoading(false)
                        ], RECORDS_SUCCESS));
                    });
                }
                else {
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        return response.json().then(function (error) {
                            recordError(error)
                        });
                    }
                    else {
                        recordError({error: 'malformed response', response: response});
                    }

                }


            },
            error => {
                recordError(error)
            }
        );
    };
}

export {recordsRequest};


function fetchSaveRecord(id, key, value) {
    return mockFetch('/records.json', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({_id: id, key: key, value: value})
    });
}

function recordSaving(id, key, saving) {
    return {
        type: SET_RECORD_SAVING_DATA,
        id,
        key,
        saving
    };
}


function setRecordSaveError(id, key, error) {
    return {
        type: SET_RECORD_SAVE_ERROR,
        id,
        key,
        error
    };
}

export {setRecordSaveError};


function setRecord(id, key, update) {
    return {
        type: SET_RECORD_DATA,
        id,
        key,
        update
    };
}

function recordSave(id, key, value) {
    return function (dispatch) {
        dispatch(recordSaving(id, key, true));

        const recordError = function (error) {
            dispatch(batchActions([
                setRecordSaveError(id, key, error),
                recordSaving(id, key, false)
            ], SAVE_RECORD_ERROR));
        };

        return fetchSaveRecord(id, key, value).then(
            response => {
                const contentType = response.headers.get("content-type");
                if (response.ok && contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json().then(function (record) {
                        dispatch(batchActions([
                            setRecord(id, key, record),
                            recordSaving(id, key, false)
                        ], SAVE_RECORD_SUCCESS));
                    });
                }
                else {
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        return response.json().then(function (error) {
                            recordError(error)
                        });
                    }
                    else {
                        recordError({error: 'malformed response', response: response});
                    }

                }


            },
            error => {
                recordError(error)
            }
        );
    };
}

export {recordSave};



function toggleFilter(filter, value) {
    return {
        type: TOGGLE_FILTER,
        filter,
        value
    };
}

export {toggleFilter};



function setFilter(filter, value) {
    return {
        type: SET_FILTER,
        filter,
        value
    };
}

export {setFilter};
/* simple mock for fetch to mock server fetching data to save record */
import PromiseQueue from 'promise-queue';
//import {store} from '../../../App';

function randomMilliseconds(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function formatDate(date) {
    let month = (date.getMonth() + 1).toString();
    month = month.length === 1 ? '0' + month : month;
    let day = (date.getDate()).toString();
    day = day.length === 1 ? '0' + day : day;
    const year = date.getFullYear();

    return month + "/" + day + "/" + year;
}

const maxConcurrent = 1;
const maxQueue = Infinity;
let queue = new PromiseQueue(maxConcurrent, maxQueue);

function mockFetch(input, init) {
    const body = JSON.parse(init.body);
    return new Promise(function (resolve, reject) {

        queue.add(function () {

            const milliseconds = randomMilliseconds(0, 2000);
            setTimeout(function () {

                const {_id, value} = body;

                /*
                 fake db call via getting record from state
                 plan on adding timeouts and delays for mocking the request
                 */

                /*
                 const state = store.getState();
                 const recordList = state.record.recordList;

                 let currentRecord = Object.keys(recordList).map(function (key) {
                 return recordList[key];
                 }).filter(function (record) {
                 return record._id === _id;
                 });

                 currentRecord = currentRecord.length > 0 ? currentRecord[0] : {};
                 */


                let response = {
                    ok: true,
                    headers: {
                        get: function (type) {
                            let _return = null;
                            if (type === "content-type") {
                                _return = 'application/json';
                            }
                            return _return;
                        }
                    },
                    json: function () {
                        return new Promise(function (resolve, reject) {
                            resolve({
                                _id: _id,
                                value: value,
                                lastModifiedDate: formatDate(new Date()),
                                saved: true
                            })
                        })
                    }
                };
                resolve(response);
            }, milliseconds);
        })

    });
}

export {mockFetch};
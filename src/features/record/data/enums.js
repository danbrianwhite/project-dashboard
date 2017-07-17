
const recordKeysBase = {
    title: {text: "Title", type: "text", valueEmpty: "No Title Entered"},
    division: {text: "Division", type: "group", valueEmpty: "Not Assigned Yet"},
    project_owner: {text: "Product Owner", type: "group", editable: true, valueEmpty: "To Be Determined"},
    budget: {text: "Budget", type: "money", editable: true, valueEmpty: "We have no clue how much it costs!"},
    status: {text: "Status", type: "status", editable: true, valueEmpty: "No Status"},
};

const recordKeysAdd = {
    ...recordKeysBase
};

export {recordKeysAdd};


const recordKeys = {
    ...recordKeysBase,
    created: {text: "Created Date", type: "date", valueEmpty: "Not Created Yet"},
    modified: {text: "Modified Date", type: "date", valueEmpty: "Not Modified"}
};

export {recordKeys};

const statusTypes = {
    archived: {text: 'Archived'},
    delivered: {text: 'Delivered'},
    working: {text: 'Working'},
    new: {text: 'New'}
};

export {statusTypes};
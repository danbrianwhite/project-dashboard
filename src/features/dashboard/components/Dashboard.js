import React from 'react';
import {connect} from 'react-redux';
import Records from '../../record/components/Records';

class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {};
    }


    render() {


        return (
            <div>
                <Records/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        state: state
    }
};

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
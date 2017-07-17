import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentFilterList from 'material-ui/svg-icons/content/filter-list';
import ReactTooltip from "react-tooltip";

import RecordFilter from './RecordFilter';

import uuidV4 from 'uuid/v4';

class RecordFilterDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {open: false};

        this.tooltipUUIDFilter = uuidV4();
    }

    handleOpen = () => this.setState({open: true});

    handleClose = () => this.setState({open: false});

    render() {
        return (
            <div style={outerStyle}>
                <ReactTooltip id={this.tooltipUUIDFilter} effect="solid" place="top">
                    <span>Filter Records</span>
                </ReactTooltip>
                <FloatingActionButton
                    data-tip data-for={this.tooltipUUIDFilter}
                    onTouchTap={this.handleOpen}
                >
                    <ContentFilterList />
                </FloatingActionButton>
                <Drawer
                    docked={false}
                    width={400}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}
                    containerStyle={drawerStyle}
                >
                    <AppBar
                        title={<span>Filter Results</span>}
                        iconElementRight={<IconButton onTouchTap={this.handleClose}><NavigationClose /></IconButton>}
                        iconElementLeft={<div></div>}
                    />
                    <div>
                        <RecordFilter/>
                    </div>
                </Drawer>
            </div>
        );
    }
}

export default RecordFilterDrawer

const outerStyle = {
    textAlign: 'left'
};

const drawerStyle = {
    backgroundColor: '#f3f3f3'
};
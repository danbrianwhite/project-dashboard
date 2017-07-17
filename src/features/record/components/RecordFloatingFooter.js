import React from 'react';
import {connect} from 'react-redux';
import uuidV4 from 'uuid/v4';
import {SpeedDial, SpeedDialItem} from 'react-mui-speeddial';
import FontAwesome from 'react-fontawesome';
import ContentSave from 'material-ui/svg-icons/content/save';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {white} from 'material-ui/styles/colors';
import ReactTooltip from "react-tooltip";
import RecordFilterDrawer from './RecordFilterDrawer';
import RecordAdd from './RecordAdd';

class RecordFloatingFooter extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.tooltipUUISave = uuidV4();
    }

    savePdf() {

    }

    saveExcel() {

    }


    render() {

        let showTooltip = this.tooltipUUISave;

        return (
            <div style={footerOuterStyle}>
                <ReactTooltip id={this.tooltipUUISave} effect="solid" place="top">
                    <span>Save Record</span>
                </ReactTooltip>
                <ReactTooltip id={this.tooltipUUISave + 'pdf'} effect="solid" place="left" offset={{top: 2}}>
                    <span>PDF</span>
                </ReactTooltip>
                <ReactTooltip id={this.tooltipUUISave + 'excel'} effect="solid" place="left" offset={{top: 2}}>
                    <span>Excel</span>
                </ReactTooltip>

                <div style={{...buttonWrapperStyle, ...floatLeftStyle}}>
                    <RecordFilterDrawer/>
                </div>

                <div style={{...buttonWrapperStyle, ...marginStyle}}>
                    <RecordAdd/>
                </div>

                <div style={buttonWrapperStyle}>
                    <SpeedDial
                        fabContentOpen={
                            <div data-tip data-for={showTooltip} style={saveTipStyle}>
                                <ContentSave style={saveIconStyle} color={white}/>
                            </div>
                        }
                        fabContentClose={
                            <div data-tip data-for={showTooltip} style={saveTipStyle}>
                                <NavigationClose style={saveIconStyle} color={white}/>
                            </div>
                        }
                    >

                        <SpeedDialItem
                            fabContent={<div data-tip data-for={this.tooltipUUISave + 'pdf'} style={saveTipStyle}>
                                <FontAwesome name='file-pdf-o'/>
                            </div>}
                            onTouchTap={this.savePdf}
                        />

                        <SpeedDialItem
                            fabContent={<div data-tip data-for={this.tooltipUUISave + 'excel'} style={saveTipStyle}>
                                <FontAwesome name='file-excel-o'/>
                            </div>}
                            onTouchTap={this.saveExcel}
                        />

                    </SpeedDial>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordFloatingFooter);

const footerOuterStyle = {
    position: 'fixed',
    bottom: 15,
    right: 0,
    width: '100%',
    zIndex: 2,
    pointerEvents: 'none',
    textAlign: 'right',
    boxSizing: 'border-box',
    paddingRight: 15,
    paddingLeft: 15
};

const buttonWrapperStyle = {
    display: 'inline-block',
    pointerEvents: 'all'
};

const marginStyle = {
    marginRight: 15
};

const floatLeftStyle = {
    float: 'left'
};

const saveTipStyle = {
    width: '100%',
    height: '100%',
    fontSize: 22
};

const saveIconStyle = {
    position: 'relative',
    top: -2,
    height: '100%'
};
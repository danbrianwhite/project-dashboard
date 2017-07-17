import React from 'react';
import {FormattedMessage} from 'react-intl';
import {withRouter} from 'react-router-dom';
import {grey400, grey700} from 'material-ui/styles/colors';

class Structure extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    year() {
        return new Date().getYear() + 1900;
    }

    render() {
        var year = this.year();

        return (
            <div>
                <div style={headerStyle}>
                    <h1 style={headerTextStyle}>
                        <FormattedMessage
                            id="logo text"
                            defaultMessage={`Project Dashboard`}
                            values={{year}}
                        />
                    </h1>
                </div>
                <div style={{padding: '0 50px', marginTop: 64}}>
                    <div style={{padding: 24, minHeight: 'calc(100vh - 173px)'}}>
                        {this.props.children}
                    </div>
                </div>
                <div style={footerStyle}>
                    <FormattedMessage
                        id="footer"
                        defaultMessage={`Dan White ©{year}`}
                        values={{year}}
                    />
                </div>
            </div>

        )
    }
}

export default withRouter(Structure);

const headerStyle = {
    position: 'fixed',
    zIndex: 2,
    top: 0,
    left: 0,
    width: '100%',
    height: 70,
    lineHeight: '70px',
    textAlign: 'center',
    background: grey700,
    color: grey400,
};

const footerStyle = {
    position: 'fixed',
    zIndex: 1,
    bottom: 0,
    left: 0,
    width: '100%',
    height: 50,
    lineHeight: '50px',
    textAlign: 'center',
    background: grey700,
    color: grey400,
};

const headerTextStyle = {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 74,
    textAlign: 'left'
};

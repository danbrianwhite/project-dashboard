/*
 DelayFadeOut Component
 */

import React from 'react';

class DelayFadeOut extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeOut: false,
            done: false
        };

        this.delay = this.props.delay ? this.props.delay : 500;
        this.duration = this.props.duration ? this.props.duration : 500;
        this.cssDuration = (this.duration / 1000).toFixed(2);
    }

    componentDidMount() {
        setTimeout(function () {
                this.setState({fadeOut: true}, function () {
                    setTimeout(function () {
                            this.setState({done: true});
                        }.bind(this),
                        this.duration
                    )
                });
            }.bind(this),
            this.delay
        )
    }

    render() {
        const fadeOut = this.state.fadeOut;
        const done = this.state.done;

        const mergeStyle = {
            ...this.props.style,
            ...baseStyle,
            ...(fadeOut ? {
                ...fadeOutStyle,
                transition: 'visibility 0s, opacity ' + this.cssDuration + 's linear'
            } : {})
        };

        return (
            done ? null :
                <div style={mergeStyle}>
                    {this.props.children}
                </div>
        )
    }
}


export default DelayFadeOut;


const baseStyle = {
    visibility: 'visible',
    opacity: '1'
};

const fadeOutStyle = {
    visibility: 'hidden',
    opacity: '0'
};
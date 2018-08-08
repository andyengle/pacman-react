import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const App = React.createClass({

    getInitialState () {
        return {
            pacmanSize: 40,
            color: '#EEEE00',
            open: true,

            facing: 'right',
            isChomping: true,

            pacmanX: 0,
            pacmanY: 0,

            pacmanMaximumX: 0,
            pacmanMaximumY: 0,

            pacmanShowing: false
        };
    },


    // ===== Lifecycle =========================================================

    componentDidMount () {
        // Without the setTimeout here, React will complain that the state of an
        // unmounted component is being changed.  Perfect setTimeout(..., 0) use
        // case.
        setTimeout(() => {
            window.addEventListener('resize', this.handleResize);
        }, 0);

        this.handleResize();

        this.toggleOpenMouthState();

        // Listen for keyup events on the window object.
        window.addEventListener('keyup', this.keyListener);

        const { windowWidth, windowHeight } = this.getWindowDimensions();

        this.setState({
            pacmanX: ((windowWidth / 2) - (this.state.pacmanSize / 2)),
            pacmanY: ((windowHeight / 2) - (this.state.pacmanSize / 2)),
            pacmanShowing: true
        });
    },

    componentWillUnmount () {
        // Don't listen for keyup events on the window object.
        window.removeEventListener('keyup', this.keyListener);
    },

    toggleOpenMouthState () {
        setTimeout(() => {
            this.setState({
                open: !this.state.open
            });

            // Do it all over again in so many milliseconds.
            this.toggleOpenMouthState();
        }, 250);
    },


    // ===== Movement ==========================================================

    keyListener (e) {
        const keyPressed = String.fromCharCode(e.keyCode).toLowerCase();
        let facing;

        if (keyPressed === '&') {
            console.log('user pressed key: up');
            facing = 'up';
        } else if (keyPressed === '\(') {
            console.log('user pressed key: down');
            facing = 'down';
        } else if (keyPressed === '\'') {
            console.log('user pressed key: right');
            facing = 'right';
        } else if (keyPressed === '%') {
            console.log('user pressed key: left');
            facing = 'left';
        }

        if (this.movementTimer) {
            clearTimeout(this.movementTimer);
        }

        this.movement();

        if (facing !== null) {
            this.setState({
                facing: facing,
                isChomping: true
            });
        }
    },


    movement () {
        const stepSize = 5;
        let pacmanX = this.state.pacmanX;
        let pacmanY = this.state.pacmanY;
        let keepMoving = true;

        switch (this.state.facing) {
            case 'right':
                pacmanX = pacmanX + stepSize;
                break;
            case 'up':
                pacmanY = pacmanY - stepSize;
                break;
            case 'down':
                pacmanY = pacmanY + stepSize;
                break;
            case 'left':
                /* drops through */
            default:
                pacmanX = pacmanX - stepSize;
                break;
        }

        // Pacman can't go beyond the right wall.
        if (pacmanX > this.state.pacmanMaximumX) {
            pacmanX = this.state.pacmanMaximumX;
        }

        // Pacman can't go beyond the left wall.
        if (pacmanX < 0) {
            pacmanX = 0;
        }

        // Pacman can't go beyond the bottom wall.
        if (pacmanY > this.state.pacmanMaximumY) {
            pacmanY = this.state.pacmanMaximumY;
        }

        // Pacman can't go beyond the top wall.
        if (pacmanY < 0) {
            pacmanY = 0;
        }


        if ((pacmanX < 0) ||
            (pacmanY < 0) ||
            (pacmanX > this.state.pacmanMaximumX) ||
            (pacmanY > this.state.pacmanMaximumY)) {
            keepMoving = false;
        }


        if (keepMoving === true) {
            this.setState({
                pacmanX,
                pacmanY
            });

            this.movementTimer = setTimeout(() => {
                // Do it all over again in so many milliseconds.
                this.movement();
            }, 40);
        }
    },


    // ===== Window resizing ===================================================

    handleResize () {
        this.setState(this.getWindowDimensions);
    },

    getWindowDimensions () {
        return {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            pacmanMaximumX: (window.innerWidth - (this.state.pacmanSize * 2)),
            pacmanMaximumY: (window.innerHeight - (this.state.pacmanSize * 2))
        };
    },

    render() {
        const pacmanSize = this.state.pacmanSize;
        const color = this.state.color;

        const pacmanStyle = {
            width: '0px',
            height: '0px',
            borderTopLeftRadius: `${pacmanSize}px`,
            borderTopRightRadius: `${pacmanSize}px`,
            borderBottomLeftRadius: `${pacmanSize}px`,
            borderBottomRightRadius: `${pacmanSize}px`,

            borderRight: `${pacmanSize}px solid ${color}`,
            borderLeft: `${pacmanSize}px solid ${color}`,
            borderTop: `${pacmanSize}px solid ${color}`,
            borderBottom: `${pacmanSize}px solid ${color}`,

            // Position
            left: `${this.state.pacmanX}px`,
            top: `${this.state.pacmanY}px`,
            position: 'absolute'
        };

        if ((this.state.isChomping === true) && (this.state.open === true)) {
            switch (this.state.facing) {
                case 'right':
                    pacmanStyle.borderRight = `${pacmanSize}px solid transparent`;
                    break;
                case 'up':
                    pacmanStyle.borderTop = `${pacmanSize}px solid transparent`;
                    break;
                case 'down':
                    pacmanStyle.borderBottom = `${pacmanSize}px solid transparent`;
                    break;
                case 'left':
                    /* drops through */
                default:
                    pacmanStyle.borderLeft = `${pacmanSize}px solid transparent`;
                    break;
            }
        }

        if (this.state.pacmanShowing === false) {
            pacmanStyle.display = 'none';
        }

        if (this.state.open === false) {
            pacmanStyle.borderRight = `${pacmanSize}px solid ${color}`;
        }

        return (
            <div className="screen-container">
                <div className="pacman-container">
                    <div className="pacman" style={pacmanStyle} />
                </div>
            </div>
        );

        // return (
        //     <div />
        // );


    }
});

export default App;

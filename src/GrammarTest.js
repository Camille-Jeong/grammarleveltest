import React, { Component } from 'react';
import ProgressBar from 'progressbar.js';
import { OXQuiz, FindWrongBlockQuiz, FillBlankQuiz } from './Quiz.js';

class CountdownBar extends Component {
    componentDidMount() {
        this.bar = new ProgressBar.Line('#timer', {
            color: '#aaa',
            trailColor: '#fff',
            // easing: 'easeInOut'
        });
        this.startCountdown();
    }

    startCountdown(timeInSeconds=2) {
        this.bar.set(1);
        this.bar.animate(0, {
            duration: timeInSeconds * 1000
        }, this.props.onTimeout);
    }

    stopTimer() {
        console.log("Timer stopped!");
        this.bar.stop();
    }

    render() {
        return (
            <div id="timer"></div>
        );
    }
}

class GrammarTest extends Component {
    constructor(props) {
        super(props)
        // variables to check questions and answers
        this.questions = this.props.questions;
        this.correctAnswer = undefined;
        this.count = 0;
        this.answers = [];
        this.stage = 0;

        //  set states for auto-rendering
        this.state = {
            currentQuestion: this.getQuestion(),
            testStarted: false,
            testFinished: false
        }

        // prepare functions for callback
        // this.checkAnswer = this.checkAnswer.bind(this);
        this.processResponse = this.processResponse.bind(this);
        this.onTimeout = this.onTimeout.bind(this);
        this.startTest= this.startTest.bind(this);
    }

    startTest() {
        console.log("Test started!!");
        this.setState({
            testStarted: true
        });
        this.stage = 1;
    }

    getQuestion() {
        return this.questions[this.count];
    }

    onTimeout() {
        console.log("Timeout!!!");
        this.getNextQuestion();
    }

    processResponse(response) {
        if (response === 1 || response === 2) {
            console.log("Correct!!!");
        }
        else {
            console.log("Incorrect!!!");
        }

        this.getNextQuestion();
    }

    getNextQuestion() {
        this.count++;
        if (this.count < this.questions.length) {
            this.setState({
                currentQuestion: this.getQuestion()
            });
            this.refs.timer.startCountdown();
        }
        else {
            this.count = 0;
            this.stage++;
            this.setState({
                currentQuestion: this.getQuestion()
            });
            this.refs.timer.startCountdown();
            // this.refs.timer.stopTimer();
            // this.setState({
            //     testFinished: true
            // });
        }
    }

    render() {
        // <QuestionText text={this.getQuestion()}/>
        let displayBox;
        if (!this.state.testStarted) {
            displayBox = <button className="ui button" onClick={this.startTest}>Start</button>;
        }
        else if (this.state.testFinished) {
            displayBox = <h1>Test finished!</h1>;
        }
        else {
            let questionBox;
            switch (this.stage) {
                case 1:
                    questionBox = <OXQuiz question={this.state.currentQuestion} onResponse={this.processResponse} />
                    break;
                case 2:
                    questionBox = <FindWrongBlockQuiz question={this.state.currentQuestion} onResponse={this.processResponse} />
                    break;
                case 3:
                    questionBox = <FillBlankQuiz question={this.state.currentQuestion} onResponse={this.processResponse} />

                    break;
                default:
                    throw new Error("Unsupported Stage!!!");
            }
            displayBox = (
                <div>
                <CountdownBar ref="timer" onTimeout={this.onTimeout} />
                {questionBox}
                </div>
            );
        }
        return (
            <div className="ui text container">
            <div className="ui very padded segment">
                {displayBox}
            </div>
            </div>
        );
    }
}

export default GrammarTest;

import React  from 'react';

class Quiz extends React.Component {
    constructor(props) {
        super(props);

        this.initializeProperties(props);
        this.setTextAndAnswer();
        this.setFeedback();
    }

    initializeProperties(props) {
        this.question = props.question;
        this.sentence_correct = this.question.sentence_correct;
        this.sentence_incorrect = this.question.sentence_incorrect;
        this.callback = props.onResponse;
        this.answer = undefined;
    }

    componentWillReceiveProps(nextProps) {
        this.initializeProperties(nextProps);
        this.setTextAndAnswer();
        this.setFeedback();
    }

    setTextAndAnswer() {
        this.text = <h1>question text</h1>;
    }
    setFeedback() {
        this.feedback = <button>Okay</button>;
    }

    render() {
        return (
            <div>
              {this.text}
              {this.feedback}
            </div>
        );
    }
}

class OXQuiz extends Quiz {
    setTextAndAnswer() {
        let text;
        if (Math.random() < 0.5) {
            text = this.sentence_correct;
            this.answer = 0;
        } else {
            text = this.sentence_incorrect;
            this.answer = 1;
        }
        this.text = <h1>{text}</h1>;
    }

    setFeedback() {
        this.feedback = (
            <div>
            <button className="ui button" onClick={() => this.checkAnswer(0)}>
                <i className="radio icon" />
            </button>
            <button className="ui button" onClick={() => this.checkAnswer(1)}>
                <i className="remove icon" />
            </button>
            </div>
        );
    }

    checkAnswer(answer) {
        let response;
        if (this.answer === answer) {
            if (this.answer === 0) {
                response = 1;
            } else {
                response = 2;
            }
        } else {
            if (this.answer === 0) {
                response = 3;
            } else {
                response = 4;
            }
        }
        this.callback(response);
    }
}

class FindWrongBlockQuiz extends Quiz {
    setTextAndAnswer() {
        let words_incorrect = this.sentence_incorrect.split(" ");
        let words_correct = this.sentence_correct.split(" ");
        this.answer = undefined;

        //  calculate right answer
        words_incorrect.forEach( (word, index) => {
            if (words_correct[index] !== word) {
                if (!this.answer) {
                    this.answer = index;
                } else {
                    throw new Error("Multiple mismatches between correct and incorrect sentence");
                }
            }
        });

        const wordButtons = words_incorrect.map( (word, index) => 
            <button className="ui button" key={index.toString()} onClick={() => this.checkAnswer(index)}>{word}</button>
        );
        this.text = (
            <div>
            {wordButtons}
            </div>
        );
    }

    setFeedback() {
        this.feedback = undefined;
    }

    checkAnswer(answer) {
        let response;
        if (this.answer === answer) {
            response = 1;
        } else {
            response = this.sentence_incorrect.split(" ")[this.answer];
        }

        this.callback(response);
    }
}

class FillBlankQuiz extends Quiz {
}

export { OXQuiz, FindWrongBlockQuiz, FillBlankQuiz };
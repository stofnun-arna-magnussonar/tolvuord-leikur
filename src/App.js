import React, { useState, useEffect } from 'react';
import _ from 'underscore';
import './style.css';

const sessionLength = 10;

function App() {
	const [question, setQuestion] = useState(null);
	const [message, setMessage] = useState(null);
	const [lastAttempt, setLastAttempt] = useState(null);
	const [asking, setAsking] = useState(false);
	const [initialized, setInitialized] = useState(false);
	const [tolvuord, setTolvurod] = useState(null);
	const [session, setSession] = useState(0);
	const [score, setScore] = useState(0);

	useEffect(() => {
		if (!tolvuord) {
			fetch('tolvuord.json').then((res) => res.json()).then((json) => {
				setTolvurod(json);
			})
		}
	});

	let shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}

		return array
	}

	let createQuestion = () => {
		setAsking(true);
		setSession(session+1);

		let questionObj = {
			rightAnswer: tolvuord[Math.floor(Math.random() * tolvuord.length)],

			answer1: tolvuord[Math.floor(Math.random() * tolvuord.length)],
			answer2: tolvuord[Math.floor(Math.random() * tolvuord.length)],

			questionLang: Math.round(Math.random())
		}

		setQuestion(questionObj)
	};

	if (tolvuord && !asking && session <= sessionLength+1) {
		createQuestion();
	}

	let capitalize = (s) => {
		return s.charAt(0).toUpperCase()+s.slice(1);
	}

	let answerQuestion = (answer) => {
		let message;

		let isDefinition = _.findWhere(question.rightAnswer, {lang: 'IS'}).definition;

		if (answer == question.rightAnswer[question.questionLang == 0 ? 1 : 0].word) {
			setLastAttempt('rétt');
			setMessage('<em>'+capitalize(question.rightAnswer[question.questionLang].word)+'</em> merkir <em>'+answer+'.</em>'+(isDefinition && isDefinition.length > 0 ? '<br/><small>Skilgreining: <i>'+isDefinition+'</i></small>' : ''));
			setScore(score+1);
		}
		else {
			setLastAttempt('vitlaust');
			setMessage('<em>'+capitalize(question.rightAnswer[question.questionLang].word)+'</em> merkir <em>'+question.rightAnswer[question.questionLang == 0 ? 1 : 0].word+'.</em>'+(isDefinition && isDefinition.length > 0 ? '<br/><small>Skilgreining: <i>'+isDefinition+'</i></small>' : ''));
		}

		setAsking(false);
	}

	let answers = question ? shuffleArray([
		<div><a href="#" onClick={(event) => {
			event.preventDefault();
			answerQuestion(question.rightAnswer[question.questionLang == 0 ? 1 : 0].word);
		}}>{question.rightAnswer[question.questionLang == 0 ? 1 : 0].word}</a></div>,
		<div><a href="#" onClick={(event) => {
			event.preventDefault();
			answerQuestion(question.answer1[question.questionLang == 0 ? 1 : 0].word);
		}}>{question.answer1[question.questionLang == 0 ? 1 : 0].word}</a></div>,
		<div><a href="#" onClick={(event) => {
			event.preventDefault();
			answerQuestion(question.answer2[question.questionLang == 0 ? 1 : 0].word);
		}}>{question.answer2[question.questionLang == 0 ? 1 : 0].word}</a></div>
	]) : [];

	return (
		<div className="app">

			<div className="session-wrapper">
				<span className="current">{session <= sessionLength ? session : sessionLength}</span><span className="slash">/</span><span className="total">{sessionLength}</span>
			</div>

			{
				message &&
				<div className={'message-wrapper'+(lastAttempt ? (lastAttempt == 'rétt' ? ' correct' : ' incorrect') : '')}>
					{
						lastAttempt &&
						<div className="heading">{lastAttempt == 'rétt' ? 'Rétt' : 'Rangt'}</div>
					}
					<div className={'message'} dangerouslySetInnerHTML={{__html: message}} />
				</div>
			}
			{
				question &&
				<div className="question-wrapper">
						<div className={'results-wrapper'+(session == sessionLength+1 ? ' visible' : '')}>
							<div className="heading">Þú náðir {score} réttum af {sessionLength}.</div>
							<a onClick={() => {
								setScore(0);
								setSession(1);
							}}>Byrja aftur</a>
						</div>

					<div className="question">Hvað þýðir <em>{question.rightAnswer[question.questionLang].word}</em>?</div>

					<div className="answers">
					{
						answers
					}
					</div>

				</div>
			}
		</div>
	);
}

export default App;

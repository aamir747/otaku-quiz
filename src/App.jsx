import logo from './logo.svg';
import torii from './assets/torii-gate.png'
import mangapages from './assets/mangapages.png'
import fujimaru from './assets/Fujimaru-Regular.ttf'
import './App.css';
import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid'

function App() {
	//----------DIFFICULTY----------//
	const [diff, setDiff] = useState('medium');
	function handleDiffChange(event) { setDiff(event.target.value) };

	//----------FETCHING_DATA----------//
	const [data, setData] = useState([]);

	const url = `https://opentdb.com/api.php?amount=10&category=31&difficulty=${diff}&type=multiple`;
	async function getData() {
		let fetchedData = await fetch(url);
		let json = await fetchedData.json();
		let arr = await json.results;
		setData(arr);
	}

	//----------CURRENT_PAGE----------//
	const [page, setPage] = useState('Landing');
	function handlePageChange() {
		setPage(page === 'Landing' ? 'Quiz' : 'Landing');
	}

	useEffect(() => {
		getData()
	}, [diff]);

	return (
		<div className='flex justify-center items-center w-screen h-screen bg-white'>
			<div className='w-[540px] h-[540px] bg-white flex flex-col justify-center items-center relative overflow-hidden border-2 border-black'>
				{page === 'Landing' && <Background />}
				{page === 'Landing' && <LandingPage diff={diff} handleDiffChange={handleDiffChange} handlePageChange={handlePageChange} />}
				{page === 'Quiz' && <QuizPage data={data} handlePageChange={handlePageChange} />}
			</div>
		</div>
	);
}

function LandingPage(props) {
	return (
		<div className='flex flex-col -mt-36'>
			<div className='w-56 h-56 relative bg-red-700 rounded-full font-[fujimaru] flex flex-col justify-center items-center'>
				<p className='text-white text-base -mb-3'>オタククイズ</p>
				<p className='text-black text-8xl -mb-2 drop-shadow-[4px_4px_0px_rgba(185,28,28,1)]'>otaku</p>
				<p className='text-white text-5xl'>quiz</p>
			</div>
			<button onClick={props.handlePageChange} className='h-12 w-54 bg-black hover:text-red-700 hover:scale-105 transition duration-75 -mt-3 font-[fujimaru] text-3xl pb-2 z-10 text-white stroke-red-700 stroke-2'>start</button>
			<div className='flex justify-between mt-6'>
				<p className='text-black font-[fujimaru] text-xl z-10'>Difficulty:</p>
				<select className='bg-white form-select drop-shadow-xl inline-block font-[fujimaru] text-xl' value={props.diff} onChange={props.handleDiffChange}>
					<option value="easy">Easy</option>
					<option value="medium">Medium</option>
					<option value="hard">Hard</option>
				</select>
			</div>
		</div>
	);
}

function QuizPage(props) {
	//----------SHUFFLING_ANSWERS----------//
	function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}

	//----------USER_ANSWERS----------//
	const [userAnswers, setUserAnswers] = useState([
		{ optionNum: null, selectedAnswer: '' },
		{ optionNum: null, selectedAnswer: '' },
		{ optionNum: null, selectedAnswer: '' },
		{ optionNum: null, selectedAnswer: '' },
		{ optionNum: null, selectedAnswer: '' },
		{ optionNum: null, selectedAnswer: '' },
		{ optionNum: null, selectedAnswer: '' },
		{ optionNum: null, selectedAnswer: '' },
		{ optionNum: null, selectedAnswer: '' },
		{ optionNum: null, selectedAnswer: '' },
	]);

	let allQuesAnswered = React.useRef(false);
	const nullsLeft = userAnswers.filter(obj => obj.optionNum === null);
	if (nullsLeft.length === 0) {
		allQuesAnswered.current = true;
	}

	function handleAnswer(event, Id, OptionNum) {
		setUserAnswers(prev => {
			return prev.map((obj, index) => {
				const newArr = index === Id ? { optionNum: OptionNum, selectedAnswer: event.target.value } : obj;
				return newArr;
			})
		});
	}

	//----------QUIZ_PAGE_DATA----------//
	const [quizPageData, setQuizPageData] = useState(shuffleAnswers());

	function shuffleAnswers() {
		return props.data.map((obj, index) => {
			const arr = [obj.correct_answer, ...obj.incorrect_answers];
			return shuffleArray(arr);
			// return <MCQ question={obj.question} answers={shuffledArr} key={`${index}`} id={`${index}`} handleAnswer={handleAnswer} selectedOption={userAnswers[index].optionNum} />
		})
	}

	return (
		<div className='w-full h-full bg-white flex flex-col overflow-y-auto pb-20'>
			{quizPageData.map((obj, index) => { return <MCQ question={props.data[index].question} answers={quizPageData[index]} key={`${index}`} id={`${index}`} handleAnswer={handleAnswer} selectedOption={userAnswers[index].optionNum} /> })}
			<div className='bg-white w-full h-20 absolute bottom-0 flex justify-evenly items-center  border-t border-black'>
				<button onClick={props.handlePageChange} className='h-12 w-56 bg-white hover:text-red-700 hover:scale-105 transition duration-75 font-[fujimaru] text-3xl pb-2 z-10 text-black stroke-red-700 stroke-2 border border-black'>back</button>
				<button disabled={!allQuesAnswered.current} className='disabled:cursor-not-allowed disabled:bg-gray-400 h-12 w-56 bg-black enabled:hover:text-red-700 enabled:hover:scale-105 transition duration-75 font-[fujimaru] text-3xl pb-2 z-10 text-white stroke-red-700 stroke-2'>submit</button>
			</div>
		</div>
	)
}

function MCQ(props) {
	function decodeEntity(inputStr) {
		var textarea = document.createElement("textarea");
		textarea.innerHTML = inputStr;
		return textarea.value;
	}

	return (
		<div className='w-full h-fit bg-white px-16 py-6 flex flex-col gap-3 border-b'>
			<p className="font-[serif] text-lg">{decodeEntity(props.question)}</p>
			<div className='flex gap-3 flex-wrap'>
				<button onClick={(event) => props.handleAnswer(event, parseInt(props.id), 0)} className={`font-[serif] w-fit h-11 px-3 border border-gray-400 whitespace-nowrap  hover:scale-105 hover:text-red-700 transition duration-75 hover:drop-shadow-sm ${props.selectedOption === 0 ? 'bg-black text-white hover:text-white' : ''}`} value={decodeEntity(props.answers[0])}>{decodeEntity(props.answers[0])}</button>
				<button onClick={(event) => props.handleAnswer(event, parseInt(props.id), 1)} className={`font-[serif] w-fit h-11 px-3 border border-gray-400 whitespace-nowrap  hover:scale-105 hover:text-red-700 transition duration-75 hover:drop-shadow-sm ${props.selectedOption === 1 ? 'bg-black text-white hover:text-white' : ''}`} value={decodeEntity(props.answers[1])}>{decodeEntity(props.answers[1])}</button>
				<button onClick={(event) => props.handleAnswer(event, parseInt(props.id), 2)} className={`font-[serif] w-fit h-11 px-3 border border-gray-400 whitespace-nowrap  hover:scale-105 hover:text-red-700 transition duration-75 hover:drop-shadow-sm ${props.selectedOption === 2 ? 'bg-black text-white hover:text-white' : ''}`} value={decodeEntity(props.answers[2])}>{decodeEntity(props.answers[2])}</button>
				<button onClick={(event) => props.handleAnswer(event, parseInt(props.id), 3)} className={`font-[serif] w-fit h-11 px-3 border border-gray-400 whitespace-nowrap  hover:scale-105 hover:text-red-700 transition duration-75 hover:drop-shadow-sm ${props.selectedOption === 3 ? 'bg-black text-white hover:text-white' : ''}`} value={decodeEntity(props.answers[3])}>{decodeEntity(props.answers[3])}</button>
			</div>
		</div>
	)
}

function Background() {
	return (
		<div className='w-[540px] h-100% flex flex-col justify-center items-center'>
			<div className='rotate-0 w-[540px] h-fit absolute drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] bg-white top-0 overflow-hidden'>
				<img className='opacity-30 animate-[move_120s_linear_infinite]' src={mangapages} alt="" />
			</div>
			<div className='rotate-12 w-[540px] h-fit absolute drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] bg-white top-0 left-48 overflow-hidden'>
				<img className='opacity-30 animate-[move2_120s_linear_infinite]' src={mangapages} alt="" />
			</div>
			<div className='-rotate-12 w-[540px] h-fit absolute drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] bg-white top-0 right-48 overflow-hidden'>
				<img className='opacity-30 animate-[move2_120s_linear_infinite]' src={mangapages} alt="" />
			</div>
			<img className='w-[540px] absolute bottom-0' src={torii} alt="torii-gate" />
		</div>
	)
}

export default App;
import logo from './logo.svg';
import './App.css';
import fujimaru from './assets/Fujimaru-Regular.ttf'
import torii from './assets/torii-gate.png'
import mangapages from './assets/mangapages.png'
import React, { useState, useEffect } from 'react';

function App() {
  //----------DIFFICULTY----------//
  const [diff, setDiff] = useState('medium');
  function handleDiffChange(event) { setDiff(event.target.value) };

  //----------FETCHING_DATA----------//
  const [data, setData] = useState([]);
  useEffect(() => {
    getData()
  }, [diff]);
  const url = `https://opentdb.com/api.php?amount=10&category=31&difficulty=${diff}&type=multiple`;
  async function getData() {
    let fetchedData = await fetch(url);
    let json = await fetchedData.json();
    let arr = await json.results;
    setData(arr);
  }
  // getData().then(results => console.log(results));

  //----------CURRENT_PAGE----------//
  const [page, setPage] = useState('Landing');
  function handlePageChange(event) {
    setPage(page === 'Landing' ? 'Quiz' : 'Landing');
  }

  return (
    <div className='flex justify-center items-center w-screen h-screen bg-white'>
      <div className='w-[540px] h-[540px] bg-white drop-shadow-[0_0_20px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center relative overflow-hidden'>
        {page === 'Landing' && <Background />}
        {page === 'Landing' && <LandingPage diff={diff} handleDiffChange={handleDiffChange} handlePageChange={handlePageChange} />}
        {page === 'Quiz' && <QuizPage data={data} />}
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
      <button onClick={props.handlePageChange} className='h-12 w-54 bg-black hover:text-red-700 hover:scale-105 transition duration-300 -mt-3 font-[fujimaru] text-3xl pb-2 z-10 text-white stroke-red-700 stroke-2'>start</button>
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

      // Generate random number
      var j = Math.floor(Math.random() * (i + 1));

      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    console.log(array)
    return array;
  }

  const quizPageData = props.data.map((obj) => {
    const arr = [obj.correct_answer, ...obj.incorrect_answers];
    const shuffledArr = shuffleArray(arr);
    return <MCQ question={obj.question} answers={shuffledArr} />
  })

  //----------USER_ANSWERS----------//
  const [userAnswers, setUserAnswers] = useState([]);
  return (
    <div className='w-full h-full bg-white flex flex-col overflow-y-auto'>
      {quizPageData}
      {/* <MCQ question={props.data[0].question} answers={[props.data[0].correct_answer, ...props.data[0].incorrect_answers]} /> */}
      {/* <MCQ question={props.data[1].question} answers={[props.data[1].correct_answer, ...props.data[1].incorrect_answers]} /> */}
      {/* <MCQ question={props.data[2].question} answers={[props.data[2].correct_answer, ...props.data[2].incorrect_answers]} /> */}
      {/* <MCQ question={props.data[3].question} answers={[props.data[3].correct_answer, ...props.data[3].incorrect_answers]} /> */}
    </div>
  )
}

function MCQ(props) {
  function decodeEntity(inputStr) {
    var textarea = document.createElement("textarea");
    textarea.innerHTML = inputStr;
    return textarea.value;
  }

  // console.log(props.answers);
  return (
    <div className='w-full h-fit bg-white px-16 py-6 flex flex-col gap-3 border-b'>
      <p className="font-[serif] text-lg">{decodeEntity(props.question)}</p>
      <div className='flex gap-3 flex-wrap'>
        <button className='font-[serif] bg-white w-fit h-11 px-3 border border-gray-400 whitespace-nowrap  hover:scale-105 transition duration-300 hover:drop-shadow-sm'>{decodeEntity(props.answers[0])}</button>
        <button className='font-[serif] bg-white w-fit h-11 px-3 border border-gray-400 whitespace-nowrap  hover:scale-105 transition duration-300 hover:drop-shadow-sm'>{decodeEntity(props.answers[1])}</button>
        <button className='font-[serif] bg-white w-fit h-11 px-3 border border-gray-400 whitespace-nowrap  hover:scale-105 transition duration-300 hover:drop-shadow-sm'>{decodeEntity(props.answers[2])}</button>
        <button className='font-[serif] bg-white w-fit h-11 px-3 border border-gray-400 whitespace-nowrap  hover:scale-105 transition duration-300 hover:drop-shadow-sm'>{decodeEntity(props.answers[3])}</button>
      </div>
    </div>
  )
}

function Background() {
  return (
    <div className='w-100% h-100% flex flex-col justify-center items-center'>
      <div className='rotate-0 w-100% h-fit absolute drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] bg-white top-0 overflow-hidden'>
        <img className='opacity-30 animate-[move_120s_linear_infinite]' src={mangapages} alt="" />
      </div>
      <div className='rotate-12 w-[540px] h-fit absolute drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] bg-white top-0 left-48 overflow-hidden'>
        <img className='opacity-30 animate-[move2_120s_linear_infinite]' src={mangapages} alt="" />
      </div>
      <div className='-rotate-12 w-[540px] h-fit absolute drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] bg-white top-0 right-48 overflow-hidden'>
        <img className='opacity-30 animate-[move2_120s_linear_infinite]' src={mangapages} alt="" />
      </div>
      <img className='w-100% absolute bottom-0' src={torii} alt="torii-gate" />
    </div>
  )
}

export default App;
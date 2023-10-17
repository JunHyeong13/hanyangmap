import logo from './logo.svg';
import Test from './Test';
import './App.css';

function App() {
  return ( // <div></div> 부분의 경우 화면에 띄워주고 싶은 내용을 구성.
    <div>Hello world!
      <Test /> 
    </div>
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { TezosToolkit } from "@taquito/taquito";

var total =0
const address = "tz1dor4MK3fX3UZbH6ecAJQRNdc1o7TQxKhS"
const tezos = new TezosToolkit("http://localhost:20001");
async function repaint(){
  total++
  var balance = await tezos.tz.getBalance(address);
  //balance = 12
  total = balance / 10 ** 6
  ReactDOM.render(
    <React.StrictMode>
      <App value={total}/>
    </React.StrictMode>,
    document.getElementById('root')
  );
}
setInterval(repaint, 1000)

// fixing CORS 
// const cors=require("cors");
// const corsOptions ={
//    origin:'*', 
//    credentials:true,            //access-control-allow-credentials:true
//    optionSuccessStatus:200,
// }

//App.use(cors(corsOptions));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

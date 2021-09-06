
import React, { Component } from 'react';
import Token from '../abis/Token.json';
import EthSwap from '../abis/Ethswap.json';
import Main from './Main';
import Navbar from './navbar';
import './App.css';
import Web3 from 'web3';

class App extends Component {
  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchaindata()
  }
  async loadBlockchaindata(){
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts()    
    this.setState({account: accounts[0]})
   const ethBalance = await web3.eth.getBalance(this.state.account)
   this.setState({ethBalance})
   
   //Load Token
   const networkId =await web3.eth.net.getId()
   const TokenData = Token.networks[networkId]
   if (TokenData){   
   const token= new web3.eth.Contract(Token.abi, TokenData.address)
   this.setState({token})
   let tokenBalance = await token.methods.balanceOf(this.state.account).call()
   console.log("tokenBalance", tokenBalance.toString())
   this.setState({tokenBalance : tokenBalance.toString()})
   } else{
     window.alert('Token contract not deployed to the detected network')
   }
      //Load EthSwap//    
      const EthSwapData = EthSwap.networks[networkId]
      if (EthSwapData){   
      const ethSwap= new web3.eth.Contract(EthSwap.abi, EthSwapData.address)
      this.setState({ethSwap})
      } else{
        window.alert('Token contract not deployed to the detected network')
      }
      this.setState({loading:false})
     }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    } 
  }
  buyTokens = (etherAmount) =>{
    this.setState({loading:true})
    this.state.ethSwap.methods.buyTokens().send({value: etherAmount ,from : this.state.account}).on('TransactionHash', (hash)=>{
      this.setState({loading:false})
    })
  }
  sellTokens = (tokenAmount) =>{
    this.setState({loading:true})
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({from : this.state.account}).on('TransactionHash', (hash)=>{
      this.state.token.methods.sellTokens(tokenAmount).send({from : this.state.account}).on('TransactionHash', (hash)=>{
      this.setState({loading:false})
    })
  })
  }
    constructor(props) {
      super(props);
      this.state = {
        account: '',
        ethBalance: '0',
        token:{},
        ethSwap:{},
        tokenBalance:'0',
        loading: true
    };
    }
     
  
  render() {
    let content    
    if(this.state.loading) {
      content= <p id="Loader" className="text-center">Loading......</p>
    }
    else {
      content =<Main 
      ethBalance={this.state.ethBalance}
      tokenBalance={this.state.tokenBalance}
      buyTokens={this.buyTokens}
      sellTokens={this.sellTokens}
      />
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '600px'}}>
              <div className="content mr-auto ml-auto">
                {content}                
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


import './App.css';

import { useState } from 'react';

import {useMoralis, useMoralisWeb3Api} from "react-moralis";

function App() {
  
  const Web3API = useMoralisWeb3Api();
  const [addr, setAddr] = useState("");
  const [nfts, setNfts] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [invite, setInvite] = useState("");
  const [fetched, setFetched] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();
  const login = async (provider) => {
    setLoading(true);
    setErr("");
    if (!addr) {

      await authenticate({signingMessage: "Log in" , provider})
        .then(function (user) {
         // console.log("logged in user:", user);
          let address = (user.get("ethAddress"));
          if (address) {
          setAddr(address);
          
          Web3API.account.getNFTs({chain: "polygon", address: "0x9BeD455088a8f879123B7e17ad1C3F2B489935dc"})
            .then(({result}) => {
              setLoading(false);
             // console.log(res);
             // res.forEach(())
             //console.log(result);
             setFetched(true);
             result.forEach(obj => {
              console.log(obj);
              if (obj.token_address.toLowerCase() === "0x07a886834bb7Cf8439a4905561a1ce1C5C2064da".toLowerCase()) {
                setConfirmed(true);
                fetch(`https://d2fpytyvizqk1j.cloudfront.net/confirm/${address}`, {method: "GET"})
                .then(txt => {
                  return txt.json();
               //   setInvite(res);
                })
                .then(res => {
                  setInvite(res.invite);
                })
              }
             })
            })
          }
        })
        .catch(function (error) {
         
          setErr(error.message);
          setLoading(false);
        });
    }
  }
  return (
    <div id = "modal-container">
      <main id = "modal">
      <h2> Welcome to Buidler's Tribe NFT Verifcation! </h2>
      <p> Connect with a wallet below to join the Buidler's channel </p>
     {!addr && 
     <>
     <button disabled = {loading} onClick={() => login("metamask")} className = {"call-to-action"} style = {{background: "orange", color: "white"}}> Connect with MetaMask</button>
     </>}
     {addr && (fetched? (confirmed? <h3 style = {{color: "green"}}> {invite? <>You have been confirmed </> : <>Loading invitation...</>} </h3> : <h3 style = {{color: "red"}}> This account doesn't own a Buidler NFT. Try again with another address </h3>) : <h3 style = {{color: "orange"}}> Loading... </h3>)}
      <br />
     {confirmed && (
      <button className="call-to-action" style = {{background: "blue", color: "white"}}  onClick = {() => window.open(invite)}> Join Buidlers Channel in BuidlersTribe </button>
     )}
     <span style = {{color: "red"}}> {err && "ERROR: " + err} </span>
      </main>
    </div>
  );
}

export default App;


import './App.css';

import { useEffect, useState } from 'react';

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
  const [notFound, setNotFound] = useState(false);
  
  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();
  useEffect(() => {
    if (err) {
      logout();
      setAddr("");
    }
  }, [err])
  const login = async (provider) => {
    console.log(window.location.href.split("/")[window.location.href.split("/").length - 1]);
    setLoading(true);
    setErr("");
    
    if (!addr) {

      await authenticate({signingMessage: "Log in" , provider})
        .then(function (user) {
         // console.log("logged in user:", user);
          let address = (user.get("ethAddress"));
          if (address) {
          setAddr(address);
          
          Web3API.account.getNFTs({chain: "polygon", address})
            .then(({result}) => {
              setLoading(false);
             // console.log(res);
             // res.forEach(())
             //console.log(result);
             setFetched(true);
             let found = false;
             result.forEach(obj => {
              found = true;
              if (obj.token_address.toLowerCase() === "0x07a886834bb7Cf8439a4905561a1ce1C5C2064da".toLowerCase()) {
                setConfirmed(true);
                fetch(`https://d2fpytyvizqk1j.cloudfront.net/confirm/${address}/${window.location.href.split("/")[window.location.href.split("/").length - 1]}`, {method: "GET"})
                .then(txt => {
                  return txt.json();
               //   setInvite(res);
                })
                .then(res => {
              //    console.log(res);
                  if (res.invite)
                  setInvite(res.invite);
                })
                .catch(() => {
               
                  setErr("API Error occured. Has your link already been used? Try typing !verify again")
                })
              }
             })
             if (!found) {
              setErr("This account doesn't own a Buidler NFT. Try again with another address");
             }
             
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
        <img src = "/logo.png" width = "20%" />
        <div style={{position: "relative", top: "-50px"}}>

        <h2 > Welcome to Buidlers Tribe NFT Verifcation! </h2>
        <p> Connect with a wallet below to join the Buidlers channel </p>
      {(!addr) && 
      <>
      <button disabled = {loading} onClick={() => login("metamask")} className = {"call-to-action"} style = {{background: "orange", color: "white"}}> Connect with MetaMask</button>
      </>}
      {addr && (fetched? (confirmed? <h3 style = {{color: "green"}}> {invite? <>You have been confirmed </> : (!err && <>Loading invitation...</>)} </h3> : <h3 style = {{color: "red"}}>  </h3>) : <h3 style = {{color: "orange"}}> Loading... </h3>)}
        <br />
      {invite && (
        <button className="call-to-action" style = {{background: "blue", color: "white"}}  onClick = {() => window.open(invite)}> Join Buidlers Channel in BuidlersTribe </button>
      )}
      <h3 style = {{color: "red"}}> {err && "ERROR: " + err} </h3>
        </div>
      </main>
    </div>
  );
}

export default App;

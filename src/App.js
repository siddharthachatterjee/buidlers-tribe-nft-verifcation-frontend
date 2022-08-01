
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
  const number = window.location.href.split("/");
  const id = number[number.length - 1] || 0;//;[window.location.href.split("/").length - 1];
  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();
  useEffect(() => {
    // if (err) {
    //   logout();
    //   setAddr("");
    // }
  }, [err])
  const login = async (provider) => {
    console.log();
    setLoading(true);
    setErr("");
    
    if (!addr) {

      await authenticate({signingMessage: "Log in" , provider})
        .then(function (user) {
         // console.log("logged in user:", user);
        console.log(user);
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
                fetch(`${process.env.REACT_APP_API_URL}/confirm/${address}/${id}`, {method: "GET"})
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
    <div>

      {<div id = "modal-container">
          <div id = "left">
            <h3 id = "heading-text"> Confirm your NFT to join <span> Verified Buidlers</span> channel & get </h3>
            <h3 id = "exclusive-text"> Exclusive </h3>
            <div className='titles'>
              <h3>AMAs</h3>
              <h3>Mentoring Session</h3>
              <h3> Access to Buidl Menu</h3>
            </div>
            {(!addr || err) &&
            <>
            <button disabled = {loading || err} onClick={() => login("metamask")} className = {"call-to-action"}> Verify NFT <span class="iconify" data-icon="logos:metamask-icon"></span> </button>
            {err && <span onClick = {() => {
              logout();
              setAddr("");
              login("metamask");
            }}className='try-again'>Try Again?</span>}
            </>}
            {addr && (fetched? (confirmed? <h3 style = {{color: "green"}}> {invite? <>You're in! Click the button below to go the verified-buidlers channel. </> : (!err && <>Loading invitation...</>)} </h3> : <h3 style = {{color: "red"}}>  </h3>) : <h3 style = {{color: "orange"}}> Loading... </h3>)}
              <br />
            {invite && (
              <button className="call-to-action"   onClick = {() => window.open(invite)}> Join Verified Buidlers </button>
            )}
            <h3 style = {{color: "red"}}> {err && "ERROR: " + err} </h3>
            <p style = {{fontFamily: "Gilroy", color: "white"}}>
              Get the Buidler NFT by creating a startup profile on <a href = "https://buidl.so"> buidl.so </a>
            </p>
        </div>
        <div id = "right">
          <img src = "/verify-nft-image.png" width = "100%" />
        </div>
          
      
      </div>}
    </div>
  );
}

export default App;

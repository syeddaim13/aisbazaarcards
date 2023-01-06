//Bazar Card System
var ver = "alpha 2.3"

document.getElementById("version").innerHTML = ver

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDzO_zXhlSiPey8oZhD-Ohg2lEPqRemFjU",
    authDomain: "bazaarcards23.firebaseapp.com",
    databaseURL: "https://bazaarcards23-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "bazaarcards23",
    storageBucket: "bazaarcards23.appspot.com",
    messagingSenderId: "789757258283",
    appId: "1:789757258283:web:2e020ed48092512bc5986e",
    measurementId: "G-TECJXRNTZ2"
};

const app = initializeApp(firebaseConfig);

import {getDatabase, ref, get, set, child, update}
from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";


const db = getDatabase();

var today,dd,mm,yyyy,todaydate,todaytime

function TimeCalc(){

  today = new Date();
  dd = String(today.getDate()).padStart(2, '0');
  mm = String(today.getMonth() + 1).padStart(2, '0'); //add 1 to month as begins with 0 value; padStart to ensure 0 before ones only value
  yyyy = today.getFullYear();
  
  todaydate = dd + '/' + mm + '/' + yyyy;
  
  todaytime = String(today.getHours()).padStart(2,'0')+":"+String(today.getMinutes()).padStart(2,'0')+":"+ String(today.getSeconds()).padStart(2,'0');
  
  console.log(todaydate+" and "+todaytime)

  return new Promise((resolved) => { //wait 100 ms to ensure function complete
    let y = 0
    setTimeout(() => {
      for (var i=0; i<10; i++) {
         y++
      }
       console.log('Time gotten.')  
       resolved(y)
    }, 100)
})
  
}


var trans = 0
var prevtrans = 0
var prevcards = 0
var prevrecharges = 0

var enterMerName = document.querySelector("#enterMerID");
var enterCusName = document.querySelector("#enterCusName");
var enterAmount = document.querySelector("#enterAmount");

var findID = document.querySelector("#findID");
var findMerID = document.querySelector("#findMerID");
var findCusName = document.querySelector("#findCusName");
var findAmount = document.querySelector("#findAmount");
var findTime = document.querySelector("#findTime");

var ChargeID = document.querySelector("#ChargeID");
var ChargeMerID = document.querySelector("#ChargeMerID");
var ChargeAmount = document.querySelector("#ChargeAmount");

var RechargeID = document.querySelector("#RechargeID");
var RechargeMerID = document.querySelector("#RechargeMerID");
var RechargeAmount = document.querySelector("#RechargeAmount");



var insertBtn = document.querySelector("#insert");
var findBtn = document.querySelector("#find");
var chargeBtn = document.querySelector("#charge");
var rechargeBtn = document.querySelector("#recharge")


function getTransactions(){
  
  const dbref = ref(db);

  get(child(dbref, "metadata/")).then((snapshot) => {
    if (snapshot.exists()) {
      prevtrans = snapshot.val().transactions;
      prevtrans = parseFloat(prevtrans)+1
      console.log(prevtrans+"new val should be")
      .catch((error) => {
        console.log(error);
      });
      
    } else {
      alert("No data found");
    }
  }).catch((error) => {
    console.log(error);
  });

  return new Promise((resolved) => { //wait 500 ms to ensure function complete
    let y = 0
    setTimeout(() => {
      for (var i=0; i<10; i++) {
         y++
      }
       console.log('Loop completed.')  
       resolved(y)
    }, 500)
})
}

function getRecharges(){
  
  const dbref = ref(db);

  get(child(dbref, "metadata/")).then((snapshot) => {
    if (snapshot.exists()) {
      prevrecharges = snapshot.val().recharges;
      prevrecharges = parseFloat(prevrecharges)+1
      console.log(prevrecharges+" new val should be")
      .catch((error) => {
        console.log(error);
      });
      
    } else {
      alert("No data found");
    }
  }).catch((error) => {
    console.log(error);
  });

  return new Promise((resolved) => { //wait 500 ms to ensure function complete
    let y = 0
    setTimeout(() => {
      for (var i=0; i<10; i++) {
         y++
      }
       console.log('Loop completed.')  
       resolved(y)
    }, 500)
})
}


function getCards(){
  
  const dbref = ref(db);

  get(child(dbref, "metadata/")).then((snapshot) => {
    if (snapshot.exists()) {
      prevcards = snapshot.val().cards;
      prevcards = parseFloat(prevcards)+1

      console.log(prevcards+"new cards should be");

    } else {
      alert("No data found");
    }
  }).catch((error) => {
    console.log(error);
  });

  return new Promise((resolved) => { //wait 500 ms to ensure function complete
    let y = 0
    setTimeout(() => {
      for (var i=0; i<10; i++) {
         y++
      }
       console.log('Loop completed.')  
       resolved(y)
    }, 500)
})
}

async function InsertData() {
    await getCards()  
    await TimeCalc()
    const dbref = ref(db);

    if (isNaN(parseFloat(enterMerName.value))) {
      alert("Merchant ID must be a number.")
    }
    else {

    set(ref(db, "cards/"+ prevcards),{
        creator: parseFloat(enterMerName.value),
        customerName: enterCusName.value,
        cardID: prevcards,
        initAmount: parseFloat(enterAmount.value),
        balance: parseFloat(enterAmount.value),
        dateAdded: todaydate,
        timeAdded: todaytime
    })

    update(child(dbref, "metadata/"), {
      cards: prevcards
    })

    .then(()=>{
        alert("Card created successfully with number "+prevcards+".");
        document.getElementById("cardnumber").innerHTML = "Card number is "+prevcards+".";
    })
    .catch((error)=>{
        alert(error);
    })};
}

function FindData() {
    if (findID.value == "") {
        alert("Enter ID Value.")
    }
    else {
    const dbref = ref(db);

    get(child(dbref, "cards/" + findID.value))
    .then((snapshot)=>{
        if(snapshot.exists()){
            findCusName.innerHTML = "Customer name: " + snapshot.val().customerName;
            findAmount.innerHTML = "Card balance: " + snapshot.val().balance;
            findMerID.innerHTML = "Made by: " + snapshot.val().creator;
            findTime.innerHTML = "Made on: " + snapshot.val().dateAdded+" at "+ snapshot.val().timeAdded;
        } else {
            alert("Card not found.");
        }
    })
    .catch((error)=>{
        alert(error)
    })}
    
}

var iscardfound = -1
async function ChargeData() {
  
  await getTransactions()
  await TimeCalc()

  if (ChargeID.value == "") {
    alert("Enter ID Value.")
  } else {
    

    const dbref = ref(db);

    get(child(dbref, "cards/" + ChargeID.value)).then((snapshot) => {
      if (snapshot.exists()) {
        const currentBalance = snapshot.val().balance;
        const newBalance = currentBalance - parseFloat(ChargeAmount.value);

        if (newBalance < 0) {
          alert("Not enough funds. Current balance is "+currentBalance+".")
          location.reload();
        }
        else {

        update(child(dbref, "cards/" + ChargeID.value), {
          balance: newBalance
        })
        .then(() => {
          alert("Balance updated successfully. The new balance is SR "+newBalance+".");
        }).catch((error) => {
          alert(error);
        })};
      } else {
        alert("Card not found");
        iscardfound = 0


      }
    }).catch((error) => {
      alert(error);
    });


    get(child(dbref, "metadata/")).then((snapshot) => {
      if (snapshot.exists()) {
        trans = parseFloat(snapshot.val().transactions) + 1; // increment trans by 1
        console.log(trans+"val")
        update(child(dbref, "metadata/"), {
          transactions: trans
        })
        .catch((error) => {
          alert(error);
        });
        
      } else {
        alert("Card not found.");
        iscardfound = 0
      }
    }).catch((error) => {
      alert(error);
    });

    if (iscardfound == -1){
    console.log(prevtrans+"val about to be added")
    set(ref(db, "transactions/"+ prevtrans),{
      transactionID: prevtrans,
      amountDeducted: parseFloat(ChargeAmount.value),
      merchant: ChargeMerID.value,
      cardid: ChargeID.value,
      dateAdded: todaydate,
      timeAdded: todaytime
    })};
    
  }
}

async function RechargeData(){
  await getRecharges()
  await TimeCalc()

  if (RechargeID.value == "") {
    alert("Enter ID Value.")
  } else {
    

    const dbref = ref(db);

    get(child(dbref, "cards/" + RechargeID.value)).then((snapshot) => {
      if (snapshot.exists()) {
        const currentBalance = snapshot.val().balance;
        const newBalance = currentBalance + parseFloat(RechargeAmount.value);

        update(child(dbref, "cards/" + RechargeID.value), {
          balance: newBalance
        })
        .then(() => {
          alert("Balance updated successfully. The new balance is SR "+newBalance+".");
        }).catch((error) => {
          alert(error);
        });
      } else {
        alert("Card not found.");
      }
    }).catch((error) => {
      alert(error);
    });

    console.log(prevrecharges+"val about to be added")
    set(ref(db, "recharges/"+ prevrecharges),{
      rechargeID: prevrecharges,
      amountAdded: parseFloat(RechargeAmount.value),
      merchant: RechargeMerID.value,
      cardid: RechargeID.value,
      dateAdded: todaydate,
      timeAdded: todaytime
    });

    update(child(dbref, "metadata/"), {
      recharges: prevrecharges
    })
    
  }
}

insertBtn.addEventListener('click', InsertData);
findBtn.addEventListener('click', FindData);
chargeBtn.addEventListener('click', ChargeData);
rechargeBtn.addEventListener('click',RechargeData)


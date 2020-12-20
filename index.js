const mysql = require('mysql');
const sizeof = require('object-sizeof');
const {
  PerformanceObserver,
  performance
} = require('perf_hooks');
const {
  connected
} = require('process');
const fs = require('fs');
const {
  start
} = require('repl');
const {
  create
} = require('domain');
let UserData = JSON.parse(fs.readFileSync('./UserMockData_DE.json'));


// First you need to create a connection to the database
// Be sure to replace 'user' and 'password' with the correct values
function createConnection()
{
  return new Promise((resolve, reject)=>{
    const con = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234',
      database: 'Sinvher_TestMySQL',
    });
    con.connect((err) => {
      if (err) {
        console.log('Error connecting to Db');
        reject(err);
      }
      //console.log('Connection established');
      resolve(con);
    });

  })
}
function endConnection(con){
  return new Promise((resolve, reject)=>{
      con.end((err) => {
      if (err) {
        console.log("Ending Connection failed");
        reject(err);
      }
      resolve();
     //console.log('Connection ended');
    });

  })
}
//USER FUNCTIONS

function getUser(sql,con){
  return new Promise((resolve, reject) => {
    let t0 = performance.now()
    con.query(sql, function (error, results, fields) {
      if (error) {
        reject(error)
      }
      let t1 = performance.now();
      let time= t1-t0;
      let reqSize=sizeof(sql);
      let responseObj = {
        results: results,
        fields: fields
      }
      let resSize= sizeof(responseObj);
      //console.log(resSize);
      resolve({time, resSize, reqSize});
    });
  })
}

async function benchmarkGetUser() {
  
  //deleteUser();
  try {
    let benchmarkTimeDataPerObject = [];
    let benchmarkSizeOfObjectAv=[];
    let benchmarkSizeOfReqAv=[];

        let con=await createConnection();
        var sql="SELECT * FROM User";
        let obj = await getUser(sql,con);
        await endConnection(con);
        benchmarkTimeDataPerObject.push(obj.time);
        benchmarkSizeOfObjectAv.push(obj.resSize);
        benchmarkSizeOfReqAv.push(obj.reqSize);
    
    let averageTimePerObject = benchmarkTimeDataPerObject.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkTimeDataPerObject.length;

    console.log("avObj "+averageTimePerObject);

    let averageSizeOfObject= benchmarkSizeOfObjectAv.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkSizeOfObjectAv.length;
    console.log("size: " + averageSizeOfObject);

    let averageSizeOfReq= benchmarkSizeOfReqAv.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkSizeOfReqAv.length;
    console.log("sizeReq: " + averageSizeOfReq);



  } catch (error) {
    console.log(error)
  } finally {
    console.log("getAllUser finished")
  }
}


function createUser(sql,con) {
  return new Promise((resolve, reject) => {
    let t0 = performance.now()
    con.query(sql, function (error, results, fields) {
      if (error) {
        reject(error)
      }
      let t1 = performance.now();
      let time= t1-t0;
      let responseObj = {
        results: results,
        fields: fields
      }
      let reqSize = sizeof(sql);
      let resSize= sizeof(responseObj);
      //console.log(resSize);
      resolve({time, resSize, reqSize});
    });
  })
}

async function benchmarkCreateNewUser(runs, userAmount) {
  //deleteUser();
  try {
    let benchmarkTimeDataPerObject = [];
    let benchmarkTimeDataInWhole =[];
    let benchmarkSizeOfObjectAv=[];
    let benchmarkSizeOfReqAv=[];

    for (var i = 0; i < runs; i++) {
      let con=await createConnection()
      await emptyDatabase(con);
      await endConnection(con);
      

      let s0=performance.now();
      for (var j = 0; j < userAmount; j++) {
        let con=await createConnection();
        var stusername = "" + UserData[j].username;
        username = stusername.replace(/ /g, '');
        var sql = "INSERT INTO `User` (`id`, `username`, `userpasswort`, `thema`, `kreiert`, `letzterlogin`, `sprache`, `barrieremodus`) VALUES (NULL, '" + username + j + "', '" + UserData[j].userpasswort + "', " + UserData[j].thema + ", '" + UserData[j].kreiert + "', '" + UserData[j].letzterlogin + "', '" + UserData[j].sprache + "', '" + UserData[j].barriereModus + "')"
        let obj = await createUser(sql,con);
        await endConnection(con);
        benchmarkTimeDataPerObject.push(obj.time);
        benchmarkSizeOfObjectAv.push(obj.resSize);
        benchmarkSizeOfReqAv.push(obj.reqSize);
      }
      let s1=performance.now();
      benchmarkTimeDataInWhole.push(s1-s0);
    }
    let averageTimePerObject = benchmarkTimeDataPerObject.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkTimeDataPerObject.length;

    console.log("avObj "+averageTimePerObject);

    let averageTimeInWhole = benchmarkTimeDataInWhole.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkTimeDataInWhole.length;
    console.log("avwhole: "+averageTimeInWhole);

    let averageSizeOfObject= benchmarkSizeOfObjectAv.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkSizeOfObjectAv.length;
    console.log("size: " + averageSizeOfObject);

    let averageTimeReq = benchmarkSizeOfReqAv.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkSizeOfReqAv.length;
    console.log("avReq: "+averageTimeReq);


 


  } catch (error) {
    console.log(error)
  } finally {
    console.log("createNewUser finished")
  }
}

function updateUser(sql,con){
  return new Promise((resolve, reject) => {
    let t0 = performance.now()
    con.query(sql, function (error, results, fields) {
      if (error) {
        reject(error)
      }
      let t1 = performance.now();
      let time= t1-t0;
      let responseObj = {
        results: results,
        fields: fields
      }
      let reqSize=sizeof(sql);
      //console.log(reqSize);
      let resSize= sizeof(responseObj);
      //console.log(resSize);
      resolve({time, resSize, reqSize});
    });
  })

};

 async function benchmarkUpdateUser(startID, endID) {
   
  //deleteUser();
  try {
    let benchmarkTimeDataPerObject = [];
    let benchmarkTimeDataInWhole =[];
    let benchmarkSizeOfObjectAv=[];
    let benchmarkSizeOfReqAv=[];
  
      let s0=performance.now();
      for (var i = startID; i < endID; i++) {
        let con=await createConnection();
        var sql = "UPDATE `User` SET `username` = '" + UserData[i - (startID - 1)].username + "', `userpasswort` = '" + UserData[i - (startID - 1)].userpasswort + "', `thema` = '" + i + "', `kreiert` = '" + UserData[i - (startID - 1)].kreiert + "', `letzterlogin` = '" + UserData[i - (startID - 1)].letzterlogin + "', `sprache` = '" + UserData[i - (startID - 1)].sprache + "', `barrieremodus` = '" + UserData[i - (startID - 1)].barriereModus + "' WHERE `User`.`id` = " + i
        let obj = await updateUser(sql,con);
        await endConnection(con);
        benchmarkTimeDataPerObject.push(obj.time);
        benchmarkSizeOfObjectAv.push(obj.resSize);
        benchmarkSizeOfReqAv.push(obj.reqSize);
      }
      let s1=performance.now();
      benchmarkTimeDataInWhole.push(s1-s0);
    
    let averageTimePerObject = benchmarkTimeDataPerObject.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkTimeDataPerObject.length;

    console.log("avObj "+averageTimePerObject);

    let averageTimeInWhole = benchmarkTimeDataInWhole.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkTimeDataInWhole.length;
    console.log("avwhole: "+averageTimeInWhole);

    let averageSizeOfObject= benchmarkSizeOfObjectAv.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkSizeOfObjectAv.length;
    console.log("size: " + averageSizeOfObject);

    let averageReqSize = benchmarkSizeOfReqAv.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkSizeOfReqAv.length;
    console.log("sizeReq: " + averageReqSize);


 


  } catch (error) {
    console.log(error)
  } finally {
    console.log("updateUser finished")
  }
//   let benchmarkTimeData = [];
//   let t0 = performance.now();

//   for (var i = startID; i <= endID; i++) {

//     var sql = "UPDATE `User` SET `username` = '" + UserData[i - (startID - 1)].username + "', `userpasswort` = '" + UserData[i - (startID - 1)].userpasswort + "', `thema` = '" + i + "', `kreiert` = '" + UserData[i - (startID - 1)].kreiert + "', `letzterlogin` = '" + UserData[i - (startID - 1)].letzterlogin + "', `sprache` = '" + UserData[i - (startID - 1)].sprache + "', `barrieremodus` = '" + UserData[i - (startID - 1)].barriereModus + "' WHERE `User`.`id` = " + i
//     //var sql = "INSERT INTO `User` (`id`, `username`, `userpasswort`, `thema`, `kreiert`, `letzterlogin`, `sprache`, `barrieremodus`) VALUES (NULL, '" + UserData[i].username + "', '" + UserData[i].userpasswort + "', " + UserData[i].thema + ", '" + UserData[i].kreiert + "', '" + UserData[i].letzterlogin + "', '" + UserData[i].sprache + "', '" + UserData[i].barriereModus + "')"
//     //console.log(sql);
//     // con.query(sql, function (error) {
//     //   if (error) throw error;
//     // });
//   }
//   let t1 = performance.now();
//   benchmarkTimeData.push(t1 - t0);
//   //deleteAllUser();
//   let averageTime = benchmarkTimeData.reduce(function (a, b) {
//     return a + b
//   }, 0) / benchmarkTimeData.length;
}

function deleteUser(sql,con){
  return new Promise((resolve, reject) => {
    let t0 = performance.now()
    con.query(sql, function (error, results, fields) {
      if (error) {
        reject(error)
      }
      let t1 = performance.now();
      let time= t1-t0;
      let reqSize=sizeof(sql);
      let responseObj = {
        results: results,
        fields: fields
      }
      let resSize= sizeof(responseObj);
      console.log("--------------"+ reqSize);
      resolve({time, resSize, reqSize});
    });
  })
}
async function benchmarkDeleteUser(startID, amount) {
  try {
    let benchmarkTimeDataPerObject = [];
    let benchmarkTimeDataInWhole =[];
    let benchmarkSizeOfObjectAv=[];
    let benchmarkSizeOfRequestAv=[];

    
      

      let s0=performance.now();
      for (var i = startID; i < startID + amount; i++) {
        let con=await createConnection();
        var sql = "DELETE FROM `User` WHERE `User`.`id` = " + i;
        let obj = await deleteUser(sql,con);
        await endConnection(con);
        benchmarkTimeDataPerObject.push(obj.time);
        benchmarkSizeOfObjectAv.push(obj.resSize);
        benchmarkSizeOfRequestAv.push(obj.reqSize);
      }
      let s1=performance.now();
      benchmarkTimeDataInWhole.push(s1-s0);
    
    let averageTimePerObject = benchmarkTimeDataPerObject.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkTimeDataPerObject.length;

    console.log("avObj "+averageTimePerObject);

    let averageTimeInWhole = benchmarkTimeDataInWhole.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkTimeDataInWhole.length;
    console.log("avwhole: "+averageTimeInWhole);

    let averageSizeOfObject= benchmarkSizeOfObjectAv.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkSizeOfObjectAv.length;
    console.log("size: " + averageSizeOfObject);

    let averageReqSize = benchmarkSizeOfRequestAv.reduce(function (a, b) {
      return a + b
    }, 0) / benchmarkSizeOfRequestAv.length;
    console.log("avReqSize: "+averageReqSize);

 


  } catch (error) {
    console.log(error)
  } finally {
    console.log("deleteUser finished")
  }

  // let benchmarkTimeData = [];
  // let t0 = performance.now();

  // for (var i = startID; i < startID + amount; i++) {
  //   var sql = "DELETE FROM `User` WHERE `User`.`id` = " + i;
  //   // console.log(sql);
  //   con.query(sql, function (error) {
  //     if (error) throw error;
  //   });
  // }
  // let t1 = performance.now();
  // benchmarkTimeData.push(t1 - t0);

  // let averageTime = benchmarkTimeData.reduce(function (a, b) {
  //   return a + b
  // }, 0) / benchmarkTimeData.length;
  // console.log(averageTime);
}

async function emptyDatabase(con) {
  var sql = "DELETE FROM `User`";
  // console.log(sql);
  con.query(sql, function (error) {
    if (error) throw error;
  });
}

function writeJsonFile(data, path){
  fs.writeFile(path, JSON.stringify(data,null, 4), 'utf8', function (err) {
      if (err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  }); 
}


async function main() {
  


  await benchmarkCreateNewUser(1,1);
  //await benchmarkGetUser();
 //await benchmarkDeleteUser(464037,1);
  await benchmarkUpdateUser(467730,467731);


  //updateUser(26007, 26014);
  //deleteUser(306622,1000);
}


main();


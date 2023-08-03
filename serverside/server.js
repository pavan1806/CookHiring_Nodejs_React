import express from "express"
import mysql from "mysql"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"cookhire",
})

con.connect(function(err) {
    if(err) {
        console.log("Error in Connection");
    } else {
        console.log("Connected");
    }
})

app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM login Where email=? AND password=?';
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if(err) return res.json({Status: "Error", Error: "Error in runnig query"});
        if(result.length > 0) { 
            const userR = result[0].userRole;
            if (userR === 'admin') {
                return res.json({Status: "admin"})
            } else if (userR === 'customer') {
                return res.json({Status: "customer"})
            } else if (userR === 'jobseeker') {
                return res.json({Status: "jobseeker"})
            }
        } 

else {
            return res.json({Status: "Error", Error: "Wrong Email or Password"});
        }



    })
})


app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login (`userRole`,`email`,`username`,`mobileNumber`,`password`) VALUES (?)";
    const values=[
        req.body.userRole,
        req.body.email,
        req.body.username,
        req.body.mobileNumber,
        req.body.password
    ]
    con.query(sql,[values],(err,data)=> {
        if(err) {
            return res.json("Error");
        }
        return res.json(data);
    })
})

app.get('/getjob',(req,res)=>{
    const sql="SELECT * FROM jobs";
    con.query(sql,(err,result)=>{
        if(err) return res.json({Error:"Got an error in the sql"});
        return res.json({Status:"Success",Result:result})

        


    })
})

app.delete('/deletejob/:id',(req,res)=>{
    const personId = req.params.id;
    const sql='DELETE FROM jobs WHERE jobId = ?';
    con.query(sql, [personId], (err, result) => {
        if(err) return res.json({Error: "delete employee error in sql"});
        return res.json({Status: "Success"})
    })
})


app.get('/getcandidate',(req,res)=>{
    const sql="SELECT * FROM jobseekers";
    con.query(sql,(err,result)=>{
        if(err) return res,json({Error:"Got an error in the sql"});
        return res.json({Status:"Success",Result:result})

    })
})

app.delete('/deletecandidate/:id',(req,res)=>{
    const personId = req.params.id;
    const sql='DELETE FROM jobseekers WHERE personId = ?';
    con.query(sql, [personId], (err, result) => {
        if(err) return res.json({Error: "delete employee error in sql"});
        return res.json({Status: "Success"})
    })
})



app.put('/updatecandidate/:id', (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
  
    let sql = 'UPDATE jobseekers SET ? WHERE personId = ?';

    delete updatedData.personId;
  
    con.query(sql, [updatedData, id], (err, result) => {
      if (err) {
        console.error('Error updating candidate details', err);
        return res.json({ Status: 'Error' });
      }
      return res.json({ Status: 'Success' });
    });
  });

  app.put('/updatejob/:id', (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
  
    let sql = 'UPDATE jobs SET ? WHERE jobId = ?';
  
    // Remove jobId from updatedData
    delete updatedData.jobId;
  
    con.query(sql, [updatedData, id], (err, result) => {
      if (err) {
        console.error('Error updating job details', err);
        return res.json({ Status: 'Error' });
      }
      return res.json({ Status: 'Success' });
    });
  });
  

// Add a new job to the job table
app.post('/addJob', (req, res) => {
    const { jobDescription, jobLocation, fromDate, toDate, wagePerDay, jobPhone } = req.body;
  
    // Get the latest job ID from the job table
    const getLatestJobIdQuery = 'SELECT MAX(jobId) AS latestJobId FROM jobs';
    con.query(getLatestJobIdQuery, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
        return;
      }
  
      let latestJobId = result[0].latestJobId || 0;
      const newJobId = latestJobId + 1;
  
      // Insert the new job with the generated ID
      const addJobQuery = 'INSERT INTO jobs (jobId, jobDescription, jobLocation, fromDate, toDate, wagePerDay, jobPhone) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [newJobId, jobDescription, jobLocation, fromDate, toDate, wagePerDay, jobPhone];
      con.query(addJobQuery, values, (err, result) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Error executing query' });
          return;
        }
        res.json({ Status: 'Success', jobId: newJobId });
      });
    });
  });




app.get('/getappliedjob', (req, res) => {
    const query = 'SELECT aj.id, aj.status, j.jobDescription, j.jobLocation, j.fromDate, j.toDate, j.wagePerDay, j.jobPhone FROM jobapplications aj JOIN jobs j ON aj.job_Id = j.jobId WHERE aj.person_Id';
    con.query(query, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
        return;
      }
      res.json({ Status: 'Success', Result: result });
    });
  });



  app.get('/getappliedcandidate', (req, res) => {
    const query = 'SELECT aj.id, aj.status, j.personName, j.personAddress, j.personExp, j.personPhone, j.PersonEmail FROM jobapplications aj JOIN jobseekers j ON aj.person_Id = j.personId WHERE aj.job_Id';
    con.query(query, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
        return;
      }
      res.json({ Status: 'Success', Result: result });
    });
  });
  

  app.post('/updatestatus', (req, res) => {
    const { id, status } = req.body;
  
    const updateStatusQuery = 'UPDATE jobapplications SET status = ? WHERE id = ?';
    con.query(updateStatusQuery, [status, id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
        return;
      }
  
      // Retrieve the updated data from the jobapplications table
      const getUpdatedDataQuery = 'SELECT * FROM jobapplications';
      con.query(getUpdatedDataQuery, (err, result) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Error executing query' });
          return;
        }
  
        res.json({ Status: 'Success', Result: result });
      });
    });
  });
  

  


  app.post('/applyjob', (req, res) => {
    const { jobId } = req.params; // Retrieve the jobId from the URL parameter
    const { personName, personAddress, personYearOfExperience, personPhoneNumber, personEmail } = req.body;
  
    // Insert the new jobseeker
    const addJobseekerQuery = 'INSERT INTO jobseekers (personName, personAddress, personExp, personPhone, personEmail) VALUES (?, ?, ?, ?, ?)';
    const jobseekerValues = [personName, personAddress, personYearOfExperience, personPhoneNumber, personEmail];
    
    con.query(addJobseekerQuery, jobseekerValues, (err, jobseekerResult) => {
      if (err) {
        console.error('Error executing jobseeker query:', err);
        res.status(500).json({ error: 'Error executing jobseeker query' });
        return;
      }
  
      const newPersonId = jobseekerResult.insertId;
  
      // Insert the new job application with the generated ID and personId
      const addJobApplicationQuery = 'INSERT INTO jobapplications (job_Id, person_Id, status) VALUES (?, ?, "s")';
      const jobApplicationValues = [jobId, newPersonId];
      
      con.query(addJobApplicationQuery, jobApplicationValues, (err, jobApplicationResult) => {
        if (err) {
          console.error('Error executing job application query:', err);
          res.status(500).json({ error: 'Error executing job application query' });
          return;
        }
        
        const newJobApplicationId = jobApplicationResult.insertId;
        res.json({ status: 'Success', id: newJobApplicationId });
      });
    });
  });
  












app.listen(8081, ()=> {
    console.log("Running");
})
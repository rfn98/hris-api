/*import fetch from "node-fetch";
import { createRequire } from "module";
const require = createRequire(import.meta.url);*/
/*var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var routeSaya = require('./route/route')*/

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import Xendit from 'xendit-node'
import mongoose from "mongoose"
const Schema = mongoose.Schema;
const employeeSchema = new Schema({
	name: String,
	age: Number,
	address: String,
	gender: String
})

const EmployeeModel = mongoose.model("Employee", employeeSchema)
const x = new Xendit({ secretKey: 'xnd_development_6SPoK5JlLLQmaV5Pu5oOwyo0Dt9mcIlRpUSxAFwDq6IjlODuT3tEbcby76Nm' })

var app = express()
app.use(cors())
app.use(bodyParser.json())
// app.use(router)

app.get('/', (req, res)=>{
    res.send('<h1>Express & Firestore</h1>')
})

app.get('/balance', async (req, res) => {
	try {
		const { Balance } = x
		const balanceSpecificOptions = {}
		const b = new Balance(balanceSpecificOptions)

		const resp = await b.getBalance()
		console.log(resp);
	    res.send('API BALANCE')
	} catch (error) {

	}
})

app.post('/disbursement', async (req, res) => {
	try {
		const { Disbursement } = x;
		const disbursementSpecificOptions = {};
		const d = new Disbursement(disbursementSpecificOptions);

		const resp = await d.create({
		  externalID: 'disb-1475459775872',
		  amount: 10000,
		  bankCode: 'BCA',
		  accountHolderName: 'Jennifer',
		  accountNumber: '7437588454784',
		  description: 'Shopping Payment 123',
		});
		console.log(resp)
	    res.send('DISBURSEMENT SUCCESS')
	} catch (error) {
		console.log('ERROR DISBURSEMENT', error)
	}
})

app.post('/batch-disbursement', async (req, res) => {
	try {
		const { Disbursement } = x;
		const disbursementSpecificOptions = {};
		const d = new Disbursement(disbursementSpecificOptions);

		const resp = await d.createBatch({
		  reference: 'disb-1475459775872',
		  disbursements: [
		    {
		      externalID: 'disb-1475459775872',
		      bankCode: 'BCA',
		      accountHolderName: 'Jennifer',
		      accountNumber: '1234567',
		      description: 'Reimbursement for pair of shoes (1)',
		      amount: 20000,
		    }/*,
		    {
		      externalID: 'demo_123_2',
		      bankCode: 'BNI',
		      accountHolderName: 'MICHAEL CHEN',
		      accountNumber: '123456789',
		      description: 'Reimbursement for hotel',
		      amount: 30000,
		    }*/
		  ]
		});
		console.log('BATCH DISBURSEMENT', resp)
	    res.send('BATCH DISBURSEMENT SUCCESS')
	} catch (error) {
		console.log('ERROR DISBURSEMENT', error)
	}
})

app.post('/disbursement_callback_url/:type', async (req, res) => {
	try {
		console.log('DISBURSEMENT_CALLBACK_URL', req.params.type)
		console.log('DISBURSEMENT_CALLBACK_URL', req.params.type, req.body)
	    res.send('CALLBACK SUCCESS')
	} catch (error) {
		console.log('ERROR DISBURSEMENT', error)
	}
})

app.get('/employees', async(req, res) => {
	try {
		const list = await EmployeeModel.find()

		res.send(list)
	} catch (e) {
		console.log(`GET ALL /employee/`, e.message);
	    res.sendStatus(400);
	}
})

app.post("/employee", async (req, res) => {
  const reqData = req.body;

  try {
  	const response = await EmployeeModel.create(reqData)
  	res.send(response)
  } catch (e) {
    console.log(`POST /employee/`, e.message);
    res.sendStatus(400);
  }
});

app.put("/employee/:id", async (req, res) => {
  const id = req.params.id;
  const reqData = req.body;

  try {
  	const response = await EmployeeModel.findByIdAndUpdate(id, reqData)
  	res.send(response)
  } catch (e) {
    console.log(`POST /employee/`, e.message);
    res.sendStatus(400);
  }
});

app.delete("/employee/:id", async (req, res) => {
  const id = req.params.id;

  try {
  	const response = await EmployeeModel.findByIdAndDelete(id)
  	res.send(response)
  } catch (e) {
    console.log(`POST /employee/`, e.message);
    res.sendStatus(400);
  }
});


//configure mongoose
mongoose.set('strictQuery', false)
mongoose.connect(
  process.env.MONGODB_URI || "mongodb+srv://pjy98:5S3j6a6M3TmyrboM@cluster0.pitdt.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to MongoDB");
    }
  }
)

app.listen(3210, ()=>{
    console.log('Server aktif @port 3210')
})
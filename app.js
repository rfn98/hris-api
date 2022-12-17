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
const x = new Xendit({ secretKey: 'xnd_development_6SPoK5JlLLQmaV5Pu5oOwyo0Dt9mcIlRpUSxAFwDq6IjlODuT3tEbcby76Nm' })
// import router from './route/route'

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
		  accountNumber: '1234567',
		  description: 'Shopping Payment 123',
		});
		console.log(resp)
	    res.send('DISBURSEMENT SUCCESS')
	} catch (error) {
		console.log('ERROR DISBURSEMENT', error)
	}
})

app.post('/disbursement_callback_url', async (req, res) => {
	try {
		console.log('DISBURSEMENT_CALLBACK_URL')
		console.log('DISBURSEMENT_CALLBACK_URL', req.body)
	    res.send('CALLBACK SUCCESS')
	} catch (error) {
		console.log('ERROR DISBURSEMENT', error)
	}
})

app.listen(3210, ()=>{
    console.log('Server aktif @port 3210')
})
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import Xendit from 'xendit-node'
import mongoose from "mongoose"
import multer from 'multer'
const Schema = mongoose.Schema;
const employeeSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	gender: {
		type: String,
		required: true
	},
	age: {
		type: Number,
		required: true
	},
	address: String,
	photo: Buffer,
	mimetype: String
})

const photoSchema = new Schema({
	image: {
		type: Buffer,
		required: true
	},
	mimetype: {
		type: String,
		required: true
	}
})

const upload = multer()

const EmployeeModel = mongoose.model("Employee", employeeSchema)
const PhotoModel = mongoose.model("Photo", photoSchema)
const x = new Xendit({ secretKey: 'xnd_development_6SPoK5JlLLQmaV5Pu5oOwyo0Dt9mcIlRpUSxAFwDq6IjlODuT3tEbcby76Nm' })

var app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(upload.any());
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

function request (body, file) {
	return {...body, photo: file.buffer, mimetype: file.mimetype}
}

app.post("/employee", async (req, res) => {
  const reqData = req.body
  const file = req.files[0]

  try {
  	const response = await EmployeeModel.create(request(reqData, file))
  	res.send(response)
  } catch (e) {
    console.log(`POST /employee/`, e.message);
    res.sendStatus(400);
  }
});

app.put("/employee/:id", async (req, res) => {
  const id = req.params.id
  const reqData = req.body
  const file = req.files[0]

  try {
  	const response = await EmployeeModel.findByIdAndUpdate(id, request(reqData, file))
  	res.send(response)
  } catch (e) {
    console.log(`POST /employee/`, e.message);
    res.sendStatus(400);
  }
})

app.get("/photo/:id", async (req, res) => {
  const id = req.params.id;

  try {
  	const response = await EmployeeModel.findById(id)
  	res.contentType(response.mimetype)
    res.send(response.photo)
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

app.post("/image", async (req, res) => {
  try {
    if (req.files == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    const response = await PhotoModel.create({image: req.files[0].buffer, mimetype: req.files[0].mimetype})

    res.status(200).send(response);
  } catch (err) {
    console.log('req.file error', req.files[0])
    res.status(500).send({
      message: `Could not upload the file: ${req.files[0].originalname}. ${err}`,
    });
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
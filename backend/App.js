const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://poonam:poonam@cluster0.dc9tjug.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(
  () => {
    console.log('Connected to MongoDB');
    },
);

const vendorSchema = new mongoose.Schema({
  name: String,
});

const resourceSchema = new mongoose.Schema({
  name: String,
  resume: String,
  vendor: String,
  technologies: [String],
});

const Vendor = mongoose.model('Vendor', vendorSchema);
const Resource = mongoose.model('Resource', resourceSchema);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/api/vendors', async(req, res) => {
  try{
    const vendor =  await Vendor.create(req.body);
    return res.status(200).json({
      message: 'Vendor created',
      vendor: vendor,
    })
  }catch(e){
    return res.status(400).json({
      message: 'Vendor not created',
      error: e,
      })
  };
  }
  );

  app.get('/api/vendors', async(req,res)=>{
   let vendorlist = await Vendor.find();
   return res.status(200).json({
    message: 'Vendors found',
    vendors: vendorlist,
   });

  })


app.post('/api/resources', upload.single('resume'), async(req, res) => {
  try{
    const resource = await Resource.create({
      name: req.body.name,
      resume: req.file.filename,
      vendor: req.body.vendor,
      technologies: req.body.technologies,
    });
  }catch(e){
 
   return res.status(400).json({
    message: 'Resource not created',
    error: e,
    })
  }
});

app.get('/api/resources', async(req, res) => {
  let resourcelist = await Resource.find();
  return res.status(200).json({
    message: 'Resources found',
    resourcelist: resourcelist,
  })
});



app.listen(3001, () => {
  console.log('Server listening on port 3001');
});




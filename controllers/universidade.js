
/*configuracao do mongo -- INICIO*/
const mongoose = require('mongoose');
const UniversidadesSchema = new mongoose.Schema(
  {
    nome: String,
    data: Date,
    latitude: Number,
    longitude: Number
  }
);

let db = { Mongoose: mongoose, UniversidadesSchema }


function validateUniversidadeEntry(req){
  req.assert("nome", "O nome da universidade é obrigatório.").notEmpty();
  req.assert("latitude", "O dado de localizaçao latitude é obrigatório.").notEmpty();
  req.assert("longitude", "O dado de localizaçao longitude é obrigatório").notEmpty();

  return req.validationErrors();
}
/*configuracao do mongo -- FIM*/


module.exports = function(app){

  //consultar universidades gravadas no banco
  app.get('/buscador-de-universidades/universidades', function(req, res){

    mongoose.connect('mongodb://localhost:27017/universidadesDB', function (err, db) {
        if (err) {
            console.log("Erro ao conectar: " + err)
        } else {
            connected = true;
            DB = db;
            users = DB.collection('users');
            console.log("conectou!");
        }
    });

    let universidadesCollection = db.Mongoose.model('universidades', db.UniversidadesSchema);
    console.log(universidadesCollection);
    universidadesCollection.find({}).lean().exec(
      function (e, docs) {
        console.log(e);
          console.log(docs);
        res.status(200).send(docs);
      });
  });

  //inserir nova universidade
  app.post('/buscador-de-universidades/universidades', function(req, res){
    let universidade = req.body;

    const errors = validateUniversidadeEntry(req);
    universidade.data = new Date();

    if(errors) {
      console.log("Erros de validação");
      res.status(400).send(universidade);
      return;
    }

    mongoose.connect('mongodb://localhost:27017/universidadesDB', function (err, db) {
        if (err) {
            console.log("Erro ao conectar: " + err)
        } else {
            connected = true;
            DB = db;
            users = DB.collection('users');
            console.log("conectou!");
        }
    });

    let UniversidadesCollection = db.Mongoose.model('universidades', db.UniversidadesSchema);
    let universidadeDocument = new UniversidadesCollection(universidade);

    universidadeDocument.save(function (err) {
        if (err) {
            console.log("Error! " + err.message);
            return err;
        }
        else {
            console.log("Post saved");

            let response = {
              universidade
            }

            res.status(200).send(response);
        }
    });
  });
}

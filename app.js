const express = require('express');
const ejs = require('ejs');
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017";


//Initialisation du serveur express
const server = express();

//Dire à express de mettre les données venants du formulaire dans BODY
server.use(express.urlencoded({ extended: false }));

//Dire à express où aller trouver les vues(Nos pages web que le user sait voir)
server.set('views');

//Dire à express d'utiliser EJS comme moteur de template
server.set('view engine', 'ejs');

server.get('/apprenants', (req, res) => {

  MongoClient.connect(url, (err, db)=>{
    if (err) throw err;
    let dbo = db.db("Kenaya");
    dbo.collection('apprenants').find({}).toArray((err, result)=>{
        if (err) throw err;
        return res.send(result);
        // return res.render('apprenants/index', { apprenants: result });
        db.close();
    })
})
});

server.get('/apprenants/new', (req, res) => {
  return res.render('apprenants/new');
});

server.post('/apprenants', (req, res)=>{
  console.log(req.body.name);
  
  MongoClient.connect(url, (err, db)=>{
    if (err) throw err;
    let dbo = db.db("Kenaya");
    let requette = { name: req.body.name, prenom: req.body.prenom};
    
    dbo.collection('apprenants').insertOne(requette, (err, result)=>{
        if (err) throw err;
        return res.render('apprenants/succe');
        db.close();
    })
})
})

server.delete('/apprenants/delete/:id', (req, res)=>{
  MongoClient.connect(url, (err, db)=>{
    if (err) throw err;
    let dbo = db.db("Kenaya");
    let query = { _id: req.params.id };

    dbo.collection("apprenants").deleteOne(query, (err, result)=>{
      if (err) throw err;
      console.log(req.params.id);
      // return res.render('apprenants/delete');
      return res.send("succé");
      db.close();
    });
    
});
})

server.put('/apprenants/update/:id', (req, res)=>{
  console.log(req.body.name);
  MongoClient.connect(url, (err, db)=>{
    if (err) throw err;
    let dbo = db.db("Kenaya");
    let query = { name: null };
    
    
    let newValues = { $set: {name: req.body.name, prenom: req.body.prenom}};
    dbo.collection('apprenants').updateOne(query, newValues, (err, result)=>{
        if (err) throw err;
        return res.send('update reussi');
        db.close();
    })
})
})



//Définition du port
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});

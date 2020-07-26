const Counter = require('../../models/Counter');
const multer = require('multer');
const request = require('request');
const FormData = require('form-data');
const upload = multer();
const fetch = require('node-fetch');
const fs = require('fs');

const recorgnizeCountriesFromPlateNumber = require("../../utils");

module.exports = (app) => {
  app.post('/api/recognition', upload.single('file'), (req, res, next) => {
    
    // let body = new FormData();
    
    request({
      url: "https://api.carnet.ai/v2/mmg/detect?features=mm,mmg,color,angle",
      method: "POST",
      headers: {
        'Content-Type': 'application/octet-stream',
        'Api-Key': 'e087f4bf-340f-46d8-8a6d-9948ffad310f'
      },
      body: req.file.buffer
    }, function (err, resp, data) {
      let buffer = req.file.buffer;
      let body = new FormData();
      body.append('upload', buffer.toString('base64'));
      fetch("https://api.platerecognizer.com/v1/plate-reader/", {
          method: 'POST',
          headers: {
              "Authorization": "Token 528ec607cc73b1439208b687aa0a9dfd343ff66e"
          },
          body: body
      }).then(res => res.json())
      .then(json => {
        let recogResult = recorgnizeCountriesFromPlateNumber(json.results[0]['plate']);
        res.json({api_result: data, plateNumber: json.results[0]['plate'], countries: recogResult.result, extra: recogResult.extra});
      })
      .catch((err) => {
          console.log(err);
      });
    });
  });

  app.get('/api/counters', (req, res, next) => {
    Counter.find()
      .exec()
      .then((counter) => res.json(counter))
      .catch((err) => next(err));
  });

  // app.post('/api/counters', function (req, res, next) {
  //   const counter = new Counter();

  //   counter.save()
  //     .then(() => res.json(counter))
  //     .catch((err) => next(err));
  // });

  // app.delete('/api/counters/:id', function (req, res, next) {
  //   Counter.findOneAndDelete({ _id: req.params.id })
  //     .exec()
  //     .then((counter) => res.json())
  //     .catch((err) => next(err));
  // });

  // app.put('/api/counters/:id/increment', (req, res, next) => {
  //   Counter.findById(req.params.id)
  //     .exec()
  //     .then((counter) => {
  //       counter.count++;

  //       counter.save()
  //         .then(() => res.json(counter))
  //         .catch((err) => next(err));
  //     })
  //     .catch((err) => next(err));
  // });

  // app.put('/api/counters/:id/decrement', (req, res, next) => {
  //   Counter.findById(req.params.id)
  //     .exec()
  //     .then((counter) => {
  //       counter.count--;

  //       counter.save()
  //         .then(() => res.json(counter))
  //         .catch((err) => next(err));
  //     })
  //     .catch((err) => next(err));
  // });
};

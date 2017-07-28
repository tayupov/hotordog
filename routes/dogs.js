const config = require('config');
const express = require('express');
const session = require('express-session');
const router = express.Router();
const r = require('../db');

router.get('/', function (req, res, next) {
  console.log(req.session);
  r
    .table('dogs')
    .sample(20)
    .then(dogs => {
      res.render('pages/dog', { dogs })
    })
    .catch(error => {
      next(error);
    })
});

router.post('/', function (req, res, next) {
  const action = req.body.action;
  const dogUrl = req.body.image;

  r
    .table('dogs')
    .getAll(dogUrl, { index: 'image' })
    .then(dogArr => {
      const dog = dogArr.find(d => d.image === dogUrl);
      if (dog) {
        if (action === 'Hot') {
          dog.hot++;
        } else if (action === 'Not') {
          dog.not++;
        }
        
        r
          .table('dogs')
          .get(dog.id)
          .update(dog)
          .then(dog => {
            res.render('pages/dogInfo', { dog });
          })
          .catch(error => {
            next(error);
          });
          
      } else {
        r
          .table('dogs')
          .insert({
            image: dogUrl,
            hot: action === 'Hot' ? 1 : 0,
            not: action === 'Not' ? 1 : 0,
          }, { conflict: 'replace' })
          .then(response => {

            r.table('dogs').get(response.generated_keys[0])
            .then(dog => {
              console.log('Dog inserted:')
              console.log(dog);
              res.render('pages/dogInfo', { dog })
            })

          })
          .catch(error => {
            next(error);
          });

      }
    })
    .catch(error => {
      next(error);
    })
});

module.exports = router;
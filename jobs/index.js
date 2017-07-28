const fetch = require('node-fetch');
const config = require('config');
const r = require('../db');

function fillDB() {
    for (var i = 0; i <= 20; i++) {
        fetch(`${config.get('dogsAPI').url}/breeds/image/random`)
        .then(res => res.json())
        .then(data => {
            const image = data.message;
            const dog = {
                hot: 0,
                not: 0,
                image
            }
            r
                .table('dogs')
                .insert(dog, { conflict: 'replace' })
                .then(res => {
                    console.log(`Inserted dog:`);
                    console.log(dog);
                })
                .catch(err => {
                    console.err(err);
                })

        });
    }
}

fillDB();
console.log(fillDB.toString())
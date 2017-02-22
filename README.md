Juku käyttöliittymä
===================

Liikenneviraston joukkoliikenteen rahoitus-, kustannus- ja suoritetietojen keräys- ja seurantajärjestelmän käyttöliittymä.

Tämä käyttöliittymä on tarkoitettu vain viranomaiskäyttöön ja on näkyvissä Liikenneviraston extranetin kautta.
Käyttö edellyttää extranet-tunnukset.

Julkinen käyttöliittymä löytyy: https://juku.liikennevirasto.fi/ 
- github: https://github.com/solita/livijuku-public-front

Download the project
--------------------

Clone this repo

    git clone <repo url>

Prerequisites
-------------

You should have git and [Node.js](nodejs) installed. Recommended development os is linux or osx; windows is not supported.
The required nodejs version is defined in `.nvmrc`. 
The recommended tool to manage nodejs versions is [nvm].

The nodejs is installed locally using:

    nvm use

in the project directory. This command obtains the correct version automatically from `.nvmrc`.

Install the dependencies and build the project
------------------------

In the project directory run

    build-dist.sh

This program installs the npm components and builds the project. 

The build creates `dist`-directory, which contains the compiled application.


Running the tests
-------------

Run the end to end tests (requires backend and front running locally)

    teste2e.sh

Run unit tests

    test-unit.sh
    
The end to end tests requires that
 - the frontend application is available at: `http://localhost:9000` 
 - the database services are available at: `http://juku:juku@localhost:50000/juku/`

The frontend can be served using: `start-dev.sh`

If one of the required services is in other machine than localhost 
using ssh it is easy to forward it to the required local ports e.g. 

    ssh -L localhost:1521:192.168.50.1:1521 -L localhost:50000:192.168.50.1:50000 localhost

Running the application in development mode
---------------

Run the app locally on [http://localhost:9000](http://localhost:9000)

    start-dev.sh

This requires that the backend is available at: `localhost:8082`

[nvm]: https://github.com/creationix/nvm
[nodejs]: http://nodejs.org/

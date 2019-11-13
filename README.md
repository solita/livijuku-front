Juku käyttöliittymä
===================

Liikenne- ja viestintäviraston Juku -järjestelmän käyttöliittymä.

Tämä käyttöliittymä on tarkoitettu vain viranomaiskäyttöön ja on näkyvissä Liikenne- ja viestintäviraston extranetin kautta.
Käyttö edellyttää extranet-tunnukset.

Julkinen käyttöliittymä löytyy: https://juku.traficom.fi/ 
- github: https://github.com/solita/livijuku-public-front

Prerequisites
-------------

You should have git and [Node.js](nodejs) installed. 
Recommended development os is linux or osx; windows is not supported.
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

Development usage
--------------

Run the app locally on [http://localhost:9000](http://localhost:9000)

    start-dev.sh

This requires that the backend is available at: `localhost:8080` (See [livijuku]).

Running the tests
-------------

Run the end to end tests (requires backend and front running locally)

    teste2e.sh

Run unit tests

    test-unit.sh
    
The end to end tests requires that
 - the frontend application is available at: `http://localhost:9000` 
 - backend is available at: `localhost:8080`
 - the database test services are available at: `http://juku:juku@localhost:50000/juku/`

The frontend can be served using: `start-dev.sh`

If one of the required services is in other machine than localhost 
using ssh it is easy to forward it to the required local ports e.g. 

    ssh -L localhost:1521:192.168.50.1:1521 -L localhost:50000:192.168.50.1:50000 localhost

### Supported browser versions

Currently newest chrome and firefox is supported.

However end to end tests might not work with all firefox versions. 
You can download old firefox versions from here: https://ftp.mozilla.org/pub/firefox/releases/

[nvm]: https://github.com/creationix/nvm
[nodejs]: http://nodejs.org/
[livijuku]: https://github.com/solita/livijuku

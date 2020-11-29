<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** ironman9967, eve-echoes-trader, ledrugk, ironman9967@gmail.com, EVE Echoes Trader, A cli based market data searching system utilizing data from https://eve-echoes-market.com/api
-->


<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h3 align="center">EVE Echoes Trader</h3>

  <p align="center">
    A cli based market data searching system utilizing data from https://eve-echoes-market.com/api
    <br />
    <br />
    <a href="https://github.com/ironman9967/eve-echoes-trader/issues">Report Bug</a>
    ·
    <a href="https://github.com/ironman9967/eve-echoes-trader/issues">Request Feature</a>
  </p>
</p>


<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
	  <a href="#usage">Usage</a>
	  <ul>
	    <li><a href="#display-help">Display Help</li>
	    <li><a href="#http-server">HTTP Server</li>
	    <li><a href="#item-search">Item Search</li>
	    <li><a href="#item-names">Item Names</li>
	    <li><a href="#item-by-name">Item by Name</li>
	    <li><a href="#item-by-id">Item by ID</li>
	  </ul>
	</li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

Please note EVE Echoes Trader currently uses the local filesystem for caching.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ironman9967/eve-echoes-trader.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

<!-- USAGE EXAMPLES -->
## Usage

Please note all commands are available via `npm start`, just include the `--` required by npm to pass parameters to the application. i.e. - `npm start -- --help`

### Display Help
```
npx eve-echoes-trader --help
```

### HTTP Server
```
npx eve-echoes-trader serve --port 8765
```

### Item Search
- cli ```npx eve-echoes-trader item-search --term veld```
- api ```GET /api/item/search?term=veld```

### Item Names
- cli ```npx eve-echoes-trader item-names --use-json```
- api ```GET /api/item/names```

### Item by Name
- cli ```npx eve-echoes-trader item-by-name --name veldspar --use-json```
- api ```GET /api/item?name=veldspar```

### Item by ID
- cli ```npx eve-echoes-trader item-by-id --itemid 51000000000```
- api ```GET /api/item/51000000000```

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Your Name - [@ledrugk](https://twitter.com/ledrugk) - ironman9967@gmail.com

Project Link: [https://github.com/ironman9967/eve-echoes-trader](https://github.com/ironman9967/eve-echoes-trader)

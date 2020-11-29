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



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!--
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
-->


<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h3 align="center">EVE Echoes Trader</h3>

  <p align="center">
    A cli based market data searching system utilizing data from https://eve-echoes-market.com/api
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
	    <li><a href="#help">Help</li>
	    <li><a href="#item-search">Item Search</li>
	    <li><a href="#item-names">Item Names</li>
	    <li><a href="#item-by-name">Item by Name</li>
	    <li><a href="#item-by-id">Item by ID</li>
	  </ul>
	</li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
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

- #### Help
```
npx eve-echoes-trader --help
```

- #### Item Search
```
npx eve-echoes-trader item-search --term veld
```

- #### Item Names
```
npx eve-echoes-trader item-names --use-json
```

- #### Item by Name
```
npx eve-echoes-trader item-by-name --name veldspar --use-json
```

- #### Item by ID
```
npx eve-echoes-trader item-by-id --itemid 51000000000
```

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

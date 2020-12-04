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
	    <li><a href="#about">About</li>
	    <li><a href="#item-search">Item Search</li>
	    <li><a href="#item-names">Item Names</li>
	    <li><a href="#item-by-name">Item by Name</li>
	    <li><a href="#item-by-id">Item by ID</li>
	    <li><a href="#item-by-id-stats">Item by ID Stats</li>
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
```sh
npx eve-echoes-trader --help
```

### HTTP Server
```sh
npx eve-echoes-trader serve --port 8765
```

### About
```
GET /api/about
```
* example response: 
```json
{ "appName": "eve-echoes-trader", "version": "1.0.1", "about": "eve-echoes-trader v1.0.1" }
```

### Item Search
```
GET /api/item/search?term=[term to fuzzy search]
```
* example response for `term=veld`: 
```json
[
  {
    "id": 1552,
    "terms": [
      "veldspar"
    ],
    "score": 29.209565298787776,
    "match": {
      "veldspar": [
        "name"
      ]
    },
    "name": "Veldspar",
    "itemId": "51000000000"
  }
]
```

### Item Names
```
GET /api/item/names
```
* example response for `term=veld`: 
```json
[ "Griffin", "Bantam", "Bantam II" ]
```

### Item by Name
```
GET /api/item?name=[name to fuzzy search]
```
* example response for `name=veld`:
```json
{
  "headMeta": {
    "_id": "5fc9b65c3e811fd806709dca",
    "id": 0,
    "lastDownload": {
      "stamp": 1607054940244,
      "duration": 150
    }
  },
  "id": 1552,
  "itemId": "51000000000",
  "name": "Veldspar",
  "statsMeta": {
    "_id": "5fca92a9c0ab8d06ba41eab0",
    "itemId": "51000000000",
    "lastDownload": {
      "stamp": 1607111337181,
      "duration": 282
    }
  },
  "aggregates": {
    "time": {
      "min": 1599555600,
      "max": 1607097600,
      "mean": 1602719045.7831326
    },
    "volume": {
      "min": 2.63,
      "max": 7.62,
      "mean": 5.711277108433733
    },
    "sell": {
      "min": 1599555600,
      "max": 1607097600,
      "mean": 1602719045.7831326
    },
    "lowestSell": {
      "min": 1,
      "max": 6,
      "mean": 3.0289156626506024
    },
    "highestBuy": {
      "min": 5,
      "max": 17.14,
      "mean": 7.149590361445781
    },
    "buy": {
      "min": 4.24,
      "max": 6.52,
      "mean": 5.478024096385543
    }
  }
}
```

### Item by ID
```
GET /api/item/[item ID]
```
* example response for `/api/item/51000000000`:
```json
{
  "headMeta": {
    "_id": "5fc9b65c3e811fd806709dca",
    "id": 0,
    "lastDownload": {
      "stamp": 1607054940244,
      "duration": 150
    }
  },
  "id": 1552,
  "itemId": "51000000000",
  "name": "Veldspar",
  "statsMeta": {
    "_id": "5fca92a9c0ab8d06ba41eab0",
    "itemId": "51000000000",
    "lastDownload": {
      "stamp": 1607111337181,
      "duration": 282
    }
  },
  "aggregates": {
    "time": {
      "min": 1599555600,
      "max": 1607097600,
      "mean": 1602719045.7831326
    },
    "volume": {
      "min": 2.63,
      "max": 7.62,
      "mean": 5.711277108433733
    },
    "sell": {
      "min": 1599555600,
      "max": 1607097600,
      "mean": 1602719045.7831326
    },
    "lowestSell": {
      "min": 1,
      "max": 6,
      "mean": 3.0289156626506024
    },
    "highestBuy": {
      "min": 5,
      "max": 17.14,
      "mean": 7.149590361445781
    },
    "buy": {
      "min": 4.24,
      "max": 6.52,
      "mean": 5.478024096385543
    }
  }
}
```

### Item by ID Stats
```
GET /api/item/[item ID]/stats
```
* example response for `/api/item/51000000000/stats`:
```json
{
  "headMeta": {
    "_id": "5fc9b65c3e811fd806709dca",
    "id": 0,
    "lastDownload": {
      "stamp": 1607054940244,
      "duration": 150
    }
  },
  "id": 1552,
  "itemId": "51000000000",
  "name": "Veldspar",
  "statsMeta": {
    "_id": "5fca93b2c0ab8d06ba41f4b1",
    "itemId": "51000000000",
    "lastDownload": {
      "stamp": 1607111602723,
      "duration": 225
    }
  },
  "aggregates": {
    "time": {
      "min": 1599555600,
      "max": 1607097600,
      "mean": 1602719045.7831326
    },
    "volume": {
      "min": 2.63,
      "max": 7.62,
      "mean": 5.711277108433733
    },
    "sell": {
      "min": 1599555600,
      "max": 1607097600,
      "mean": 1602719045.7831326
    },
    "lowestSell": {
      "min": 1,
      "max": 6,
      "mean": 3.0289156626506024
    },
    "highestBuy": {
      "min": 5,
      "max": 17.14,
      "mean": 7.149590361445781
    },
    "buy": {
      "min": 4.24,
      "max": 6.52,
      "mean": 5.478024096385543
    }
  },
  "stats": [
    {
      "itemId": "51000000000",
      "time": 1599555600,
      "sell": 6.22,
      "buy": 6.38,
      "lowestSell": 1,
      "highestBuy": 7,
      "volume": null
    },
    {
      "itemId": "51000000000",
      "time": 1599570000,
      "sell": 6.15,
      "buy": 6.52,
      "lowestSell": 1,
      "highestBuy": 8,
      "volume": 5926117
    }
  ]
}
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

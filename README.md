<!-- Improved compatibility of back to top link: See: https://github.com/milk-2-dev/fuel-price/pull/73 -->
<a id="readme-top"></a>


<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/milk-2-dev/fuel-price">
    <img src="/logo.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Fuel price</h3>
  <p align="center">
    App for monitoring fuel prices in Germany.
    <br />
    <br />
    <a href="https://fuel-price-client-dev.onrender.com/">View Demo</a>
    ·
    <a href="https://github.com/milk-2-dev/fuel-price/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/milk-2-dev/fuel-price/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

This application will allow the user to monitor the current price of fuel. It is also possible to see the dynamics of price changes over a certain period.
Currently, the app uses the [api][api-url], which provides data on fuel in Germany.

### Built With

* ![MongoDB][MongoDB]
* ![Express][Express]
* ![Vue][Vue.js]
* ![Node.js][Node.js]
* ![Mapbox][Mapbox]

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

Personally, I use yarn as a package manager
* npm
  ```sh
  npm install npm@latest -g
  ```
* yarn
  ```sh
  npm install --global yarn
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo
   ```sh
   git clone https://github.com/milk-2-dev/fuel-price.git
   ```
2. Install NPM packages
   ```sh
   yarn install
   ```
3. Copy .env file and create your env file:
   - for server folder 'local' or 'development'
   - for client folder 'localenv' or 'development'
5. Run projects locally:
   - for server
      ```sh
      yarn dev:local
      ```
   - for client
      ```sh
      yarn dev:local
      ```

<!-- ROADMAP -->
## Roadmap

- [ ] Add Changelog
  - [ ] Add the ability to add stations to favorites
    - [ ] Add filter for favorites
- [ ] Add possibility to add new stations and cities
- [ ] Show a price forecast
- [ ] Create mobile app


See the [open issues](https://github.com/milk-2-dev/fuel-price/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->
## Contact

Milk - milk00000000000000@gmail.com

Project Link: [https://github.com/milk-2-dev/fuel-price](https://github.com/milk-2-dev/fuel-price)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[api-url]: https://www.benzinpreis-aktuell.de/
[demo-url]: https://fuel-price-client-dev.onrender.com/

[contributors-shield]: https://img.shields.io/github/contributors/milk-2-dev/fuel-price?style=for-the-badge&color=othneildrew
[contributors-url]: https://github.com/milk-2-dev/fuel-price/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/milk-2-dev/fuel-price?style=for-the-badge&color=%2340AEF0
[forks-url]: https://github.com/milk-2-dev/fuel-price/network/members

[stars-shield]: https://img.shields.io/github/stars/milk-2-dev/fuel-price?style=for-the-badge&color=gold
[stars-url]: https://github.com/milk-2-dev/fuel-price/stargazers

[issues-shield]: https://img.shields.io/github/issues/milk-2-dev/fuel-price?style=for-the-badge&color=red
[issues-url]: https://github.com/milk-2-dev/fuel-price/issues

[license-shield]: https://img.shields.io/github/license/milk-2-dev/fuel-price?style=for-the-badge
[license-url]: https://github.com/milk-2-dev/fuel-price/blob/master/LICENSE.txt

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/roman-klimov-b68baa150/

[product-screenshot]: /screenshot.png

[Node.js]: https://img.shields.io/badge/Node.js-35495E?style=for-the-badge&logo=nodedotjs&logoColor=4FC08D
[Express]: https://img.shields.io/badge/Express-35495E?style=for-the-badge&logo=express&logoColor=4FC08D
[MongoDB]: https://img.shields.io/badge/MongoDB-35495E?style=for-the-badge&logo=mongodb&logoColor=4FC08D

[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Mapbox]: https://img.shields.io/badge/Mapbox-35495E?style=for-the-badge&logo=mapbox&logoColor=4FC08D


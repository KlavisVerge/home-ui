import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * @customElement
 * @polymer
 */
class HomeUiApp extends PolymerElement {
  static get template() {
    return html`
      <style>
       :host {
          display: block;
          position: relative;
          width: 100%;
          height: 100%;
       }

       .container {
          position: relative;
          text-align: center;
          color: white;
        }

        .overlay {
          background-color: black;
          position: absolute;
          height: 100%;
          width: 100%;
          opacity: .5;
          top: 0;
          left: 0;
        }

        .centered {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: sans-serif;
        }
     }
      </style>
      <a href="https://www.statsplash.com/games">
        <div class="container">
          <div class="imagediv" style="background:url([[current]]); height: [[height]]; width: [[width]]; margin:0 auto;"></div>
          <div class="overlay"></div>
          <div class="centered"><h1>Welcome to StatSplash.com!</h1><p>Click anywhere to get started</p></div>
        </div>
      </a>
    `;
  }
  static get properties() {
    return {
      games: {
        type: Array,
        value: ["Fortnite", "League of Legends"]
      },
      current: {
        type: String
      },
      allimages: {
        type: Array,
        value: []
      },
      currentlocation: {
        type: Number,
        value: 0
      },
      height: {
        type: Number,
        value: 0
      },
      width: {
        type: Number,
        value: 0
      }
    };
  }

  ready() {
    super.ready();
    let requestParams = '';
    for(var i = 0; i < this.games.length; i++){
      requestParams += this.games[i] + '%7C';
    }
    if(this.games.length > 0){
      requestParams = requestParams.substring(0, requestParams.length - 3);
    }
    var url = 'https://xupmhdl2g5.execute-api.us-east-1.amazonaws.com/api/twitch-games?games=' + requestParams;
    let err = false;

    fetch(url, {
      method: 'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => {
      this.active = false;
      this.$.spinner.classList.remove('active');
      console.error('Error:', error);
      err = true;
    })
    .then(response => {
      if(err){
        return;
      }
      for(var i = 0; i < response.game.data.length; i++){
        let height = 0;
        let width = 0;
        if(window.innerWidth < 480){
          window.innerHeight - 17 + 'px';
          width = window.innerWidth - 17 + 'px';
        }else if(window.innerHeight > window.innerWidth){
          height = Math.round(window.innerWidth * .75);
          width = window.innerWidth;
        } else{
          height = window.innerHeight;
          width = Math.round(window.innerHeight * 1.25);
        }
        let url = response.game.data[i].box_art_url.replace('{width}', width).replace('{height}',  height);
        if(i === 0){
          this.current = url;
          this.height = height - 17 + 'px';
          this.width = width - 17 + 'px';
        }
        this.allimages.push(url);
      }
      let pol = this;
      window.addEventListener("resize", function(event) {
        let i = 0;
        while(i < pol.allimages.length){
          let height = 0;
          let width = 0;
          if(window.innerWidth < 480){
            window.innerHeight - 17 + 'px';
            width = window.innerWidth - 17 + 'px';
          }else if(window.innerHeight > window.innerWidth){
            height = Math.round(window.innerWidth * .75);
            width = window.innerWidth;
          } else{
            height = window.innerHeight;
            width = Math.round(window.innerHeight * 1.25);
          }
          pol.allimages[i] = response.game.data[i].box_art_url.replace('{width}', width).replace('{height}',  height);
          if(i === pol.currentlocation){
            pol.current = pol.allimages[pol.currentlocation];
            pol.width = width - 17 + 'px';
            pol.height = height - 17 + 'px';
          }
          i++;
        }
      });
      setInterval(function(poly){
        poly.currentlocation++;
        if(poly.currentlocation === pol.allimages.length){
          poly.currentlocation = 0;
        }
        let height = 0;
        let width = 0;
        if(window.innerWidth < 480){
          window.innerHeight - 17 + 'px';
          width = window.innerWidth - 17 + 'px';
        }else if(window.innerHeight > window.innerWidth){
          height = Math.round(window.innerWidth * .75);
          width = window.innerWidth;
        } else{
          height = window.innerHeight;
          width = Math.round(window.innerHeight * 1.25);
        }
        poly.current = poly.allimages[poly.currentlocation];
        poly.height = height - 17 + 'px';
        poly.width = width - 17 + 'px';
      }, 5000, this);
    });
  }
}

window.customElements.define('home-ui-app', HomeUiApp);

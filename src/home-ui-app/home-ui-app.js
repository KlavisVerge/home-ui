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
      <a href="https://statsplash.com/games">
        <div class="container">
          <div class="imagediv" style="background:url([[current]]); height: [[height]]; width: [[width]]; no-repeat;"></div>
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
    var url = 'https://3oemw4weak.execute-api.us-east-1.amazonaws.com/api/twitch-games';
      var data = {games: this.games};

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .catch(error => {
        this.active = false;
        this.$.spinner.classList.remove('active');
        console.error('Error:', error);
      })
      .then(response => {
        for(var i = 0; i < response.game.data.length; i++){
          let url = response.game.data[i].box_art_url.replace('{width}', window.innerWidth).replace('{height}',  window.innerHeight);
          if(i === 0){
            this.current = url;
            this.current = url;
            this.height = window.innerHeight - 17 + 'px';
            this.width = window.innerWidth - 17 + 'px';
          }
          this.allimages.push(url);
        }
        let pol = this;
        window.addEventListener("resize", function(event) {
          let i = 0;
          while(i < pol.allimages.length){
            pol.allimages[i] = response.game.data[i].box_art_url.replace('{width}', window.innerWidth).replace('{height}',  window.innerHeight);
            if(i === pol.currentlocation){
              pol.current = pol.allimages[pol.currentlocation];
              pol.width = window.innerWidth - 17 + 'px';
              pol.height = window.innerHeight - 17 + 'px';
            }
            i++;
          }
        });
        setInterval(function(poly){
          poly.currentlocation++;
          if(poly.currentlocation === pol.allimages.length){
            poly.currentlocation = 0;
          }
          poly.current = poly.allimages[poly.currentlocation];
          poly.height = window.innerHeight - 17 + 'px';
          poly.width = window.innerWidth - 17 + 'px';
        }, 5000, this);
      });
  }
}

window.customElements.define('home-ui-app', HomeUiApp);

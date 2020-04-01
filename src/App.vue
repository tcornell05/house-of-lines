<template>
  <div class="graphModule container">
    <div class="graphCont row">
      <div class="graph1Cont col-md-6">
        <Graph1></Graph1>
      </div>
      <div class="graph2Cont col-md-6">
        <Graph2></Graph2>
      </div>
    </div>
    <div class="row buttons">
      <div class="col-md-6 text-center">
        <div class="btn btn-primary" v-on:click="handleGraph( 1)">Generate Eulear Paths</div>
      </div>
      <div class="col-md-6 text-center">
        <div class="btn btn-primary" v-on:click="handleGraph( 2)">Generate Eulear Paths</div>
      </div>
    </div>
    <div class="row top-buffer">
      <div class="col-md-4 offset-4 slider-cont">
        <span>SPEED:</span>
        <vue-slider
                v-model="speed"
                :min="1"
                :max="20"
                :interval="1"
        ></vue-slider>
      </div>
    </div>
    <div class="row top-buffer">
      <div class="col-md-12">
      <div class="graphOutputCont window">
          <div class="graphOutput terminal">
            <div class="command">Paths: {{ pathCounter }}</div>
            <div class="command">Time: {{ algoDuration }} MS</div>
            <div class="log">
              <ul>
                <li v-bind:key="o" v-for="o in output">{{ o }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import Graph1 from './assets/graph1.svg';
  import Graph2 from './assets/graph2.svg';
  import GraphHelper from '../lib/graphHelper.js'
  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/antd.css'
  import 'bootstrap/dist/css/bootstrap.css';
  import 'bootstrap-vue/dist/bootstrap-vue.css';

  export default {
    name: 'App',
    components: {
      Graph1,
      Graph2,
      VueSlider
    },
    data: () =>{
      return {
        speed: 17,
        execs: 0,
        algoDuration: 0,
        graphs : {
          1: {
            A: ['B', 'C', 'D'],
            B: ['A', 'C', 'D'],
            C: ['A', 'B', 'D', 'E'],
            D: ['A', 'B', 'C', 'E'],
            E: ['C', 'D'],
          },
          2: {
            A: ['B', 'C', 'D'],
            B: ['A', 'C', 'E'],
            C: ['A', 'B', 'D', 'E'],
            D: ['A', 'C', 'E', 'F'],
            E: ['B', 'C', 'D', 'F'],
            F: ['D', 'E']
          }
        },
        svgPathData: {
          nodes: {
            1: {
              A: "a3QwNJPxz",
              B: "b2q26XWX",
              C: "a430KTs9nP",
              D: "a1dpZfTunK",
              E: "a40mrQWIyL"
            },
            2: {
              A: "c8A2qbAoK",
              B: "b2q26XAX",
              C: "apORXWTKE",
              D: "a1dpZfTunG",
              E: "a430KTs9nT",
              F: "a40mrQWIyD"
            }
          },
          edges: {
            1: {
              AB: "bLrTk0Rv4",
              BA: "bLrTk0Rv4",
              BC: "h39oRbQh4",
              CB: "h39oRbQh4",
              CD: "b1LmGV6zRV",
              DC: "b1LmGV6zRV",
              DA: "a17tK0WCHs",
              AD: "a17tK0WCHs",
              AC: "b1Fc2iGGWs",
              CA: "b1Fc2iGGWs",
              BD: "a8jdXJWAA",
              DB: "a8jdXJWAA",
              CE: "iRtujQMRg",
              EC: "iRtujQMRg",
              ED: "d2k6eAVr9",
              DE: "d2k6eAVr9"
            },
          2: {
              AB: "bLrTk0RvA",
              BA: "bLrTk0RvA",
              AC: "b4rURBcXuQ",
              CA: "b4rURBcXuQ",
              BC: "a9LbWP5Bj",
              CB: "a9LbWP5Bj",
              CE: "d9YZfbbv5r",
              EC: "d9YZfbbv5r",
              CD: "bD7X5s2xe",
              DC: "bD7X5s2xe",
              BE: "h39oRbQhA",
              EB: "h39oRbQhA",
              AD: "a17tK0WCHA",
              DA: "a17tK0WCHA",
              DE: "b1LmGV6zRA",
              ED: "b1LmGV6zRA",
              DF: "d2k6eAVrA",
              FD: "d2k6eAVrA",
              FE: "iRtujQMRA",
              EF: "iRtujQMRA"
          }


          }
        },
        output: ["Click a graph!"],
        pathCounter: 0
      }
    },
    methods: {
      handleGraph: function(graphId) {
        console.log(this.speed);
        this.output = [];
        this.execs++;
        this.pathCounter = 0;


        //Count execution of algorithm
        const bt = performance.now();
        const paths = GraphHelper.getEularianPaths(this.graphs[graphId]);
        const et = performance.now();
        this.algoDuration = et - bt;
        this.drawPaths(graphId, paths);
        this.componentProcessing = false;
      },
      logPath: function(path){
        this.output.push(path.join('->'))
      },
      drawPaths: async function(graphId, paths){

        const currentExecs = this.execs;
        for (let p of paths[1]){
          if (this.execs !== currentExecs) {
            return false;
          }
          let lastNode = null;
          let edges = [];
          for(let v of p) {
            if (this.execs !== currentExecs) {
              return false;
            }
            console.log(currentExecs, this.execs);
            //Highlight edge
            if (lastNode !== null) {
              const edgeId = lastNode + v;
              this.highlightEdge(graphId, edgeId);
              edges.push(edgeId);
            }
            lastNode = v;
            await this.timeout((20 - this.speed) * 20);
          }
          this.logPath(p);
          this.pathCounter++;
          //Reset edges
          this.clearEdges(graphId, edges);

        }
      },
      timeout: function(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
      },
      highlightEdge: function(graphId, edgeId ){
          console.log("EDGE HIGHLIGHT", edgeId);
          document.getElementById(this.svgPathData.edges[graphId][edgeId]).style.stroke="orange";
      },
      clearEdges: function(graphId, edges){
        edges.forEach((edgeId) => {
          document.getElementById(this.svgPathData.edges[graphId][edgeId]).style.stroke="black";
        });
      }

    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .top-buffer { margin-top:20px; }
  .buttons{
    margin-top: -100px;
  }
  .graphModule {
    position:relative;
  }
  .graphCont {
    position: relative;
  }
  .graph1Cont{
    float:left
  }
  .graph2Cont{
    float:left;
  }

  .window {
    border-radius: 3px;
    background: #222;
    color: #fff;
    overflow: hidden;
    position: relative;
    margin: 0 auto;
    width: 70%;

  &:before {
     content: ' ';
     display: block;
     height: 48px;
     background: #C6C6C6;
   }

  &:after {
     content: '. . .';
     position: absolute;
     left: 12px;
     right: 0;
     top: -3px;
     font-family: "Times New Roman", Times, serif;
     font-size: 96px;
     color: #fff;
     line-height: 0;
     letter-spacing: -12px;
   }
  }

  .terminal {
    margin: 20px;
    font-family: monospace;
    font-size: 16px;
    color: #22da26;
  }

  .terminal ul li {
    list-style: none;
  }

  .command {
    width: 0%;
    white-space: nowrap;
    color: white;
    animation: write-command 5s both;
  }

  .log {
    white-space: nowrap;
    overflow: hidden;
    animation: write-log 5s both;
  }

</style>

import { dragEnable, stackOrderNone } from 'd3';
import './App.css';
import React, { useState, useRef, useEffect } from "react";
import Plot from 'react-plotly.js';


function App() {

  const URL = "https://inverse-model-backend.onrender.com"

  //states
  const [BackgroundTextColor, SetBackgroundTextColor] = useState("rgb(255, 255, 221, 0.1)"); 
  const [BackgroundColor, SetBackgroundColor] = useState("#fcb57b"); 
  const [ModelInputFileDivDisplay, SetModelInputFileDiv] = useState("block")
  const[BackgroundText, SetBackgroundText] = useState("INVERSE MODEL IS A WEB APPLICATION THAT USES DIMENSIONAL REDUCTION TECHNIQUES TO VISUALIZE HOW INPUT DATA IS TRANSFORMED IN HIDDEN LAYERS.")
  const [LoadingCount, setLoadingCount] = useState(0);

  const [X, SetX] = useState(null);
  const [Y, SetY] = useState(null);
  const [Z, SetZ] = useState(null);
  const [C, SetC] = useState(null);


  const[TargetLayer, SetTargetLayer] = useState("null"); 
  const[Paused, SetPaused] = useState(false); 
  var interval = null; 



  //references
  const LayerTextInputRef = useRef(null); 
  const ModelInputFile = useRef(null); 
  const DataInputFile = useRef(null); 

  //tab management
  var TabDisplayMock = {
    "intro": "block", 
    "layer": "none",
    "model_graph": "none",
    "model_data_input": "none",
    "model": "none",
  }

  const [TabDisplay, SetTabDisplay] = useState(TabDisplayMock); 

  //functions
  //manage tabs
  const switchScreen = (tab) => {
    console.log("Switching")
    for (var tabs in TabDisplay){
      TabDisplayMock[tabs] = "none"; 
    }
    TabDisplayMock[tab] = "block";
    if (tab == "model_graph" || tab == "model_data_input"){
      TabDisplayMock["model"] = "block"; 
    }

    SetTabDisplay({...TabDisplayMock}); 

  }

  //turn on loading screen
  const OnLoading = () =>{
    SetPaused(false); 
    switchScreen("intro");

    SetBackgroundTextColor("rgb(231, 225, 221)"); 
    SetBackgroundColor("rgb(254, 247, 243)")
    setLoadingCount(0);


    SetBackgroundText("LOADING ")
    SetModelInputFileDiv("none");
  }

  const ErrorScreen = () =>{
    switchScreen("intro");

    SetBackgroundTextColor("rgb(0, 0, 0)"); 
    SetBackgroundColor("white")
    setLoadingCount(0);

    SetBackgroundText("ERROR: LAYER NOT FOUND. TRANSPORTING BACK IN 3 SECONDS")
    SetModelInputFileDiv("none");
  }


  //event handling
  var ModelInputFileOnClick = () => {
    ModelInputFile.current.click(); 
    console.log("Model Input File Selection Opened"); 
  }; 


  const ModelInputFileOnChange = (event) => {
    console.log("Model Input File Changed"); 
    const file = event.target.files[0]; 
    console.log(file);
    
    switchScreen("layer"); 

  };

  const LayerButtonClick = () => {
    const layer = LayerTextInputRef.current.value
    OnLoading();

    const formData = new FormData();
    const f = ModelInputFile.current.files[0]; 
    formData.append('model', f);
    formData.append('layer', layer)



    //fetch for layer
    
    const fetchLayerCorrection = () => fetch(URL + "/models/layers/", {
      mode: 'cors',
      method: "POST",
      body: formData,
    })
    .then(res => res.json())
    .then((res) => {
      console.log(res.found)
      const layer_found = res.found

      if (layer_found == false){
        ErrorScreen(); 
        setTimeout(() => switchScreen("layer"), 2000); 
      }
      else{
        clearInterval(interval);
        SetTargetLayer(layer); 
        SetPaused(true); 
        switchScreen("model_data_input");
      }
      

    })

    setTimeout(fetchLayerCorrection, 1000)


  }

  const OpenDataInput = () => {
    DataInputFile.current.click(); 
  }

  const GenerateGraph = () => {
    OnLoading(); 

    console.log(TabDisplay)

    var formData = new FormData(); 
    formData.append("model", ModelInputFile.current.files[0])
    formData.append("layer", LayerTextInputRef.current.value)

    console.log(DataInputFile.current.files)

    if (DataInputFile.current.files.length > 1){
      for (var i = 0; i < DataInputFile.current.files.length; i++){
        if (DataInputFile.current.files[i].name == "colors.npy"){
          formData.append("color", DataInputFile.current.files[i]); 
          console.log("has color!")
        }
        else{
          formData.append("data", DataInputFile.current.files[i])
        }
      }
    }
    else{
      formData.append("data", DataInputFile.current.files[0])
    }


    const fetchLayerCorrection = () => fetch(URL + "/models/graph/", {
      mode: 'cors',
      method: "POST",
      body: formData,
    })
    .then(res => res.json())
    .then((res) => {
      console.log(res.x);
      SetPaused(true); 
      switchScreen("model_graph");
      SetX(res.x)
      SetY(res.y)
      SetZ(res.z)
      if (res.hasColor){
        SetC(res.color); 
      }
    })

    fetchLayerCorrection(); 


  }

  useEffect(()=>{
    if (!Paused){
      interval = setInterval(()=>{
        if (LoadingCount < 100) setLoadingCount(c => c + 1); 
      }, 120); 
    }
    else{
      clearInterval(interval); 
    }

    return () => clearInterval(interval); 
  }, [Paused]); 

  useEffect(()=>{
    window.addEventListener('resize', () => {const a = 1});

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', () => {const a = 1});
    };
  })


  return (
    <div className="App">
      <div className="Intro" style={{display: TabDisplay["intro"]}}>


        <div className="MainBackground" style={{color: BackgroundTextColor, backgroundColor: BackgroundColor}}>
          <div>{BackgroundText.repeat(LoadingCount)}</div>
        </div>
        <div className="ModelInputFileDiv" onClick={ModelInputFileOnClick} style={{display: ModelInputFileDivDisplay}}>
          <div>UPLOAD MODEL.KERAS</div>
        </div>
        <input type="file" className="ModelInputFileInput" accept=".keras" ref={ModelInputFile} onChange={ModelInputFileOnChange}/>


      </div>

      <div className='Layer' style={{display: TabDisplay["layer"]}}>


        <div className="LayerTextInput">
          <input type="text" placeholder='NAME OF THE DENSE LAYER/EXAMPLE: dense_1' ref={LayerTextInputRef}></input>
          <button onClick={LayerButtonClick}>SEND</button>
        </div>
        <div className="LayerDescription">
          <a>INPUT THE NAME OF YOUR TARGET LAYER HERE. YOU CAN CHECK THE NAME OF YOUR TARGET LAYER BY RUNNING MODEL.SUMMARY OR LAYER.NAME</a>
        </div>


      </div>


      <div className="Model" style={{display: TabDisplay["model"]}}>
        <div className="ModelLayerTitle">{TargetLayer.toUpperCase()}</div>
        <div className="DataInput" style={{display: TabDisplay["model_data_input"]}}>
          <div onClick={OpenDataInput}>LOAD A .NPY FILE: INPUT TO YOUR MODEL</div>
          <input type="file" ref={DataInputFile} accept=".npy" multiple="multiple" onChange={GenerateGraph}></input>
        </div>
        <div style={{display: TabDisplay["model_graph"]}}>
          <Graph x={X} y={Y} z={Z} color={C}/>

        </div>
        
      </div>
    </div>
    
  );
}

const generate = () => (
  Array(500).fill(0).map(() => Math.random() * 1000 + 10)
)




const Graph = ({x, y, z, color="#428541"}) => {

  const [window_width, set_window_width] = useState(window.innerWidth)
  const [window_height, set_window_height] = useState(window.innerHeight)


  useEffect(()=>{

    const handle = () => {
      set_window_width(window.innerWidth);
      set_window_height(window.innerHeight); 

    }

    window.addEventListener('resize', handle);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handle);
    };
  })

  return (
    <Plot
      data={[
        {
          x: x, 
          y: y, 
          z: z,

          type: 'scatter3d',
          mode: 'markers',
          marker: {
            color: color,
            opacity: 0.8,
          },
        },
        
      ]}
      layout={{
        width: window_width, 
        height: window_height, 
        title: '', 
        font: {
          family: "Fontsfree Net Maison Neue Mono, sans-serif",
          weight: 600,
        },
        uirevision: true,
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
        },
        scene: {
          xaxis: {
              title: '',
              autorange: true,
              showgrid: false,
              zeroline: false,
              showline: false,
              autotick: true,
              ticks: '',
              showticklabels: false
          },
          yaxis: {
              title: '',
              autorange: true,
              showgrid: false,
              zeroline: false,
              showline: false,
              autotick: true,
              ticks: '',
              showticklabels: false
          },
          zaxis: {
              title: '',
              autorange: true,
              showgrid: false,
              zeroline: false,
              showline: false,
              autotick: true,
              ticks: '',
              showticklabels: false
          }
        },



      }}
      config={{
        scrollZoom: true,
      }}
    />
  );
}


export default App;

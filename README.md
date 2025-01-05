# [Inverse Model](https://inverse-model.vercel.app/)

Welcome to [Inverse Model](https://inverse-model.vercel.app/), a web app that lets you visualize how the first _x_ hidden layers of the model interprets the data 

**_To Put It Not-Simply_**: this web app uses dimensional reduction technique (tSNE & PCA) to visualize how a model is interpreting the data up to a certain hidden layer. 


## Instructions
When you enter the site, the first thing it should say is "upload model.keras" - let's start with what to do there.

If you're looking for a video tutorial, a **short demo video** is right [here.](https://youtu.be/C9WyWbtjpD8)

### _"upload model.keras"_

- Click on model.keras: this should open up a file selection tab
- Save your model using _model_.save("_model_name_.keras")
- Select your model (the model must be in a ".keras" file... right now the app is only compatible with keras 2.0)

### _"name of the dense layer"_

- In your code, run model_name.summary() to view the names of your layers (ex: "dense_1")
- Type in the name of the dense layer that you want to look at
  - **Remember**: the app visualizes the output of this dense layer
- Once you type in the name of the dense layer, click "send"
- If this brings you to an error page, that means that we had trouble finding a dense layer with the inputted name

### _"load your model data"_

- Create an input numpy array up to ~300 samples (200-300 samples is a good balance between sufficient data and computation time)
- Save this numpy array as a .npy file using numpy.save("_data_name_.npy", _data_array_)
- Click on the centered title and upload this .npy file
- This process may take a while

### _"change your colors"_

- Once your graph pops up, you can click on the "change color" button in the bottom right corner to change the colors
- The color should also be a .npy file, where each element is a string corresponding do the colors of each point
- Example: color_array = np.array(["rgb(20, 20, 0)", "rgb(20, 20, 100)", "rgb(20, 20, 200)"]) 
- We feed these right into marker.color in plotly.js so make sure to verify that your color format is compatible!
    - We recommend using hex values: "#xxxxx" or rgb: "rgb(20, 20, 20)"

## Framework

**Front-end:** React JS <br/>
**Back-end:** Django (Python) with Tensorflow, Numpy, and Scikit-Learn for model & data computations

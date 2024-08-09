# [Inverse Model](https://inverse-model.vercel.app/)

Welcome to Inverse Model, a web app that lets you visualize how the first _x_ hidden layers of the model interprets the data 

**_To Put It Not-Simply_**: this web app uses dimensional reduction technique (tSNE & PCA) to visualize how a model is interpreting the data up to a certain hidden layer. 


## Instructions
When you enter the site, the first thing it should say is "upload model.keras" - let's start with what to do there. 

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

  

  

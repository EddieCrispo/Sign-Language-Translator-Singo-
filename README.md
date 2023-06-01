# Sign-Language-Translator-Singo-
Sign Language Translator - Singo (Sign and Go)

Our project aims to create a **Sign Language Translator App** to improve communication for the deaf and hard of hearing. The problem statement is the difficulty in communicating with non-signers, which can lead to social isolation and limited access to information. Our research questions include what features would be most beneficial to users and how to improve accuracy and ease of use. Background information includes the prevalence of hearing loss and the lack of accessible communication options. Our team wants to tackle this problem because we believe **that everyone deserves equal access to information and communication**. Using design thinking, we aim to build a painkiller app that solves a significant problem for our users.

## Dataset Used
* [SIBI Dataset](https://drive.google.com/drive/folders/1EqzDDzEymQhqP6DFjMg1ecPbRZvQ2uq9?usp=share_link) This data is the result of self-made with reference to the datasets above and also the help of OpenCv and Mediapipe as a tool to generate images, with a total number of training data 2,210 images, 520 validation data and 104 test data images.

### SIBI sign language gesture
![SIBI gesture](https://github.com/EddieCrispo/Sign-Language-Translator-Singo-/blob/main/Machine-learning/dataset/abjad%20SIBI.jpg)

### How we create our own data

**Step 1: Import the necessary libraries**
```py
# Import the OpenCV module for image processing
import cv2
# Import the mediapipe module for hand detection and tracking
import mediapipe as mp
# Import the time module for measuring performance
import time
# Import the numpy module for working with arrays
import numpy as np

```
**Step 2: Import the necessary modules and create a hand detector object with the desired parameters and drawing specifications**
```py
# Import the drawing, hands, and drawing styles modules from mediapipe
import mediapipe as mp
mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands
mp_drawing_styles = mp.solutions.drawing_styles

# Create a hand detector object with the desired parameters
detector = mp_hands.Hands(
    max_num_hands=1, # detect only one hand at a time
    static_image_mode=True, # use static image mode instead of video mode
    min_detection_confidence=0.2, # minimum confidence threshold for detection
    min_tracking_confidence=0.2 # minimum confidence threshold for tracking
)

# Define the drawing specifications for the landmarks and connections
landmark_spec = mp_drawing.DrawingSpec(color=(0, 0, 0)) # black color for landmarks
connection_spec = mp_drawing.DrawingSpec(color=(255, 255, 255)) # white color for connections

```

**Step 3: Define some variables for image processing and saving**
```py
# Define the image size in pixels
img_size = 224

# Define the offset value for cropping
offset = 50

# Define the target directory to save the images
target_save_dir = "./dataset/custom_data/Test/"

# Define the base name for the images
img_name = "image_Z"

# Define a counter variable to keep track of the number of images
counter = 0

# Limit on the number of images you want to save
target_amount = 4
```

**Step 4: Capture and process the video frames to detect and crop the hand region and save it to a file**
```py
# Capture the video from the webcam
cap = cv2.VideoCapture(0)

# Loop until the user presses 'q' or reaches the counter limit
while True:

    # Read a frame from the video
    ret, img = cap.read()

    # Make a copy of the original image for display purposes
    img_output = img.copy()

    # Process the image and find the hand landmarks
    results = detector.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

    # Check if any hand is detected
    if results.multi_hand_landmarks:

        # Get the first detected hand
        hand_landmarks = results.multi_hand_landmarks[0]

        # Draw the landmarks and connections on the image
        mp.solutions.drawing_utils.draw_landmarks(
            img, 
            hand_landmarks, 
            mp_hands.HAND_CONNECTIONS, 
            landmark_drawing_spec=landmark_spec,
            connection_drawing_spec=connection_spec
        )

        # Extract the coordinates of the landmarks as a list of points
        points = []
        for data_point in hand_landmarks.landmark:
            points.append([data_point.x * img.shape[1], data_point.y * img.shape[0]])

        # Find the bounding rectangle of the points
        x,y,w,h = cv2.boundingRect(np.array(points).astype('float32'))

        # Create a white image of the same size as the original image
        img_white = np.ones((img_size, img_size, 3), np.uint8)*255

        # Crop the hand region from the original image with some offset
        img_crop = img[y-offset:y + h+offset, x-offset:x + w + offset]

        # Check if the cropped image is not empty
        if np.any(img_crop):

            # Resize the cropped image to fit the white image size
            img_crop = cv2.resize(img_crop, (img_size, img_size))

            # Paste the cropped image on top of the white image
            img_white[0:img_size, 0:img_size] = img_crop

            # Show the white image with the hand region
            cv2.imshow("img_white", img_white)
    
    # Wait for a key press from the user
    key = cv2.waitKey(1) & 0xFF

    # If the user presses 's', save the white image to a file and increment the counter
    if key == ord('s'):
        counter += 1
        cv2.imwrite(f"{target_save_dir}/{img_name}_({time.time()}).jpg", img_white)
        print(counter)

    # Show the original image with the landmarks and connections
    cv2.imshow("Original", img_output)

    # If the user presses 'q' or reaches the counter limit, break out of the loop
    if key == ord('q') or counter == target_amount:
        break

# Release the video capture object and close all windows
cap.release()
cv2.destroyAllWindows()
```

### Result of the saved image 

| A | B | C |
| - | - | - |
| ![A](https://github.com/EddieCrispo/Sign-Language-Translator-Singo-/blob/main/Machine-learning/dataset/Train/A/image_A_(1685164029.961901).jpg) | ![B](https://github.com/EddieCrispo/Sign-Language-Translator-Singo-/blob/main/Machine-learning/dataset/Test/B/image_B_(1685193326.274505).jpg)  | ![C](https://github.com/EddieCrispo/Sign-Language-Translator-Singo-/blob/main/Machine-learning/dataset/Test/C/image_C_(1685193348.742896).jpg) |

## Methodology
Overall, general method of the SLR (Sign Language Recognition) is shown below:

In this project, we aim to build a CNN model that can recognize hand gestures for the letters of the alphabet, which contains 2,834 images of 26 classes (A-Z) of hand gestures. We use transfer learning to reuse a pre-trained model (VGG16) and adapt it to our specific task. We also use data augmentation to increase the diversity and size of our training data. We train and evaluate our model on the training, validation, and test data, and plot and analyze the results.

### Data Preparation

The data is the result of self-made we generated images using `generator_images.py` you can see the file from our repository above in `Machine-learning/generator_images.py`. The dataset contains three subdirectories: Train, Valid, and Test. We use Train as our training data, Valid as our validation data, and Test as our test data. Each subdirectory contains 26 subdirectories (A-Z) that correspond to the classes of hand gestures. Each subdirectory contains images of hand gestures in JPG format.

We define some variables for our data paths and parameters, such as:

- `DATADIR`: The path to our dataset directory.
- `TRAIN_PATH`: The path to our training data directory.
- `VALID_PATH`: The path to our validation data directory.
- `TEST_PATH`: The path to our test data directory.
- `CATEGORIES`: A list of letters of the alphabet that correspond to the classes of hand gestures.
- `batch_size`: The number of images to process in each batch.
- `epochs`: The number of times to iterate over the entire training data.

We create image data generators for our training and validation data using the `tf.keras.preprocessing.image.ImageDataGenerator` class from tensorflow. This class allows us to apply some transformations to our images, such as rescaling, rotation, zooming, flipping, etc. These transformations help increase the diversity and size of our training data and reduce overfitting. We also use this class to load our images from their directories and resize them to `224x224 pixels`, which is the input shape for VGG16. We use RGB color mode for our images and one-hot encoding for our labels.

We create image data generator for our test data with rescale `1./255` using the same class. We do not apply any other transformations to our validation data, as we want to evaluate our model on the original images. We also load our test images from their directory and resize them to 224x224 pixels. We do not use labels for prediction, as we want to compare our predictions with the true labels later.

### Model Building

We build our CNN model using transfer learning, which is a technique of reusing a pre-trained model and adapting it to our specific task. Transfer learning can save us time and resources, as well as improve our performance by leveraging the knowledge learned from a large and diverse dataset.

We use VGG16 as our base model, which is a popular CNN model that has been trained on the `ImageNet` dataset, which contains over 14 million images of 1000 classes. We load VGG16 without the top layer, which is the layer that makes the final predictions. We also use the pretrained weights on the ImageNet dataset, so that our base model already has some features learned from it.

We then create a new model on top of the base model using `keras.Sequential([])`, which allows us to stack layers in a sequential order. We add the following layers to our new model:

- A flatten layer, which converts the output of the base model into a one-dimensional vector.
- A dense layer, which is a fully connected layer with 1024 units and relu activation function. This layer will learn some high-level features from the output of the base model.
- A dropout layer, which randomly drops out some units during training to reduce overfitting.
- A dense layer, which is another fully connected layer with num_classes units and softmax activation function. This layer will make the final predictions for our 26 classes.

We also freeze the base model, which means that we prevent it from being updated during training. This way, we can preserve the features learned from the ImageNet dataset and only update the weights of our new layers.

We compile our model with a lower learning rate of 0.00001, which means that we will make smaller updates to our weights during each iteration. This helps prevent overfitting and fine-tune our model. We use the Adam optimizer, which is an adaptive gradient descent algorithm that adjusts the learning rate dynamically. We use the categorical crossentropy loss function, which measures how well our model predicts the correct class for each image. We also use the accuracy metric, which measures how many images are correctly classified by our model.

### Model Training

We train our model using train and validation generators and callbacks:

- Model checkpoint callback: This callback monitors the validation accuracy and saves the best model based on it. This helps us keep track of the best performance and load it later for evaluation or prediction.

We use these callbacks as arguments to the fit method of the model, which takes in several other arguments, such as:

- The training data generator
- The steps per epoch
- The number of epochs
- The validation data generator
- The validation steps

The fit method returns a history object that contains information about the training process, such as:

- The loss and accuracy values for each epoch
- The validation loss and accuracy values for each epoch

### Model Evaluation

We evaluate our model on test data using sklearn and confusion matrix. We first predict our model on test data using its predict method. This method returns an array of probabilities for each class for each image. We then convert these probabilities to class labels using numpy and list comprehension. We get these class labels from test generator using its class_indices attribute.

We then get true labels from test generator using its labels attribute. These are an array of indices for each image that correspond to their true classes.

We then create confusion matrix using sklearn's confusion_matrix function. This function takes in true labels and predicted labels as arguments and returns an array that shows how many images are correctly or incorrectly classified by our model.

We then calculate error rate for each class using numpy and list comprehension. This is defined as number of incorrect predictions divided by total number of predictions for each class.

We then print predicted labels and error rate for each class using print function.

### Model Analysis

We analyze our model's performance by plotting loss and accuracy curves using matplotlib. These curves show how loss and accuracy change over epochs for both training and validation data. We access loss and accuracy values from history object using its history attribute. This is a dictionary that contains values for each metric. We plot loss values against epoch number using plt.plot function with different colors and labels for training loss and validation loss. We plot accuracy values against epoch number using plt.plot function with different colors and labels for training accuracy and validation accuracy. We add titles labels legends to plots using plt.title plt.xlabel plt.ylabel plt.legend functions respectively.

We display plots using plt.show function.

<table>
    <thead>
        <tr>
            <th colspan=3 style="text-align:center;"><img src="https://github.com/EddieCrispo/Sign-Language-Translator-Singo-/blob/main/Machine-learning/result/learning_process.png";></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
            <img src="https://github.com/EddieCrispo/Sign-Language-Translator-Singo-/blob/main/Machine-learning/sample_image/image_A_(1685538695.6025474).jpg";>
            </td>
            <td>
            <img src="https://github.com/EddieCrispo/Sign-Language-Translator-Singo-/blob/main/Machine-learning/sample_image/image_A_(1685538701.2024412).jpg";>
            </td>
            <td>
            <img src="https://github.com/EddieCrispo/Sign-Language-Translator-Singo-/blob/main/Machine-learning/sample_image/image_A_(1685538705.060244).jpg";>
            </td>
        </tr>
    </tbody>
</table>

================================================
## User Manual
have't dont yet, Coming Soon.....


### Requirements

| Requirement | Version |
| ----------- | ------- |
| Tensforflow | 2.12.0  |
| OpenCv      | 4.7.0   |
| Mediapipe   | 0.10.0  |
| Matplotlib  | 3.6.0   |
| Numpy       | 1.23.3  |
| Python      | 3.10.6  |
| Scikit-learn| 1.1.2   |

================================================

## Reference datasets
* [American Sign Language Dataset
](https://www.kaggle.com/datasets/ayuraj/asl-dataset) This dataset can be used to apply the ideas of multi class classification using the technology of your choice.
* [Sign Language MNIST](https://www.kaggle.com/datasets/datamunge/sign-language-mnist)  This dataset was inspired by the Fashion-MNIST 2 and the machine learning pipeline for gestures by Sreehari 4.
* [Datasets SIBI Sign Language Alphabets](https://www.kaggle.com/datasets/mlanangafkaar/datasets-lemlitbang-sibi-alphabets)  Indonesian Sign Language Alphabets Sign Language Datasets (Sistem Isyarat Bahasa Indonesia).

## Developers
- Muhammad Zidan R. (EddieCrispo)
- Angga Dwi S. (AnggaDS01)
- Pramestiningtyas D. (tyas-damayanti)
- Faizal Tri A. W.
- Michael Filbert T. (MichaelFilbert)
- Zulfadar Indaka A. (ZulfadarIA)

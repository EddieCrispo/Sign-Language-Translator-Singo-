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

## Requirements

| Requirement | Version |
| ----------- | ------- |
| Tensforflow | 2.12.0  |
| OpenCv      | 4.7.0   |
| Mediapipe   | 0.10.0  |
| Matplotlib  | 3.6.0   |
| Numpy       | 1.23.3  |
| Python      | 3.10.6  |
| Scikit-learn| 1.1.2   |

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

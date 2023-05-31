# Import modules
import cv2
import mediapipe as mp
import numpy as np
from predict_label import predicted_label

# Define drawing specifications for landmarks and connections
mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands
mp_drawing_styles = mp.solutions.drawing_styles

landmark_spec = mp_drawing.DrawingSpec(color=(0, 0, 0))
connection_spec = mp_drawing.DrawingSpec(color=(255, 255, 255))

# Create a hand detector object with parameters
detector = mp_hands.Hands(
  max_num_hands=1, 
  static_image_mode=True,
  min_detection_confidence=0.2, 
  min_tracking_confidence=0.2
)

# Define the image size and offset for cropping
img_size = 224
offset = 50

# Open the webcam and start capturing frames
cap = cv2.VideoCapture(0)
while True:
  # Read a frame from the webcam
  ret, img = cap.read()
  # Make a copy of the original frame for output
  img_output = img.copy()
  # Process the frame with the hand detector and get the results
  results = detector.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

  # If there are any hand landmarks detected in the frame
  if results.multi_hand_landmarks:
    # Get the first hand landmarks from the results
    hand_landmarks = results.multi_hand_landmarks[0]
    # Draw the landmarks and connections on the original frame
    mp.solutions.drawing_utils.draw_landmarks(
      img, 
      hand_landmarks, 
      mp_hands.HAND_CONNECTIONS, 
      landmark_drawing_spec=landmark_spec,
      connection_drawing_spec=connection_spec
    )

    # Create an empty list to store the landmark coordinates
    points = []
    # Loop through each landmark and append its x and y coordinates to the list
    for data_point in hand_landmarks.landmark:
      points.append([data_point.x * img.shape[1], data_point.y * img.shape[0]])
    # Get the bounding rectangle of the landmark coordinates
    x,y,w,h = cv2.boundingRect(np.array(points).astype('float32'))

    # Create a white image with the same size as the cropped image
    img_white = np.ones((img_size, img_size, 3), np.uint8)*255
    # Crop the original frame with the bounding rectangle and offset
    img_crop = img[y-offset:y + h+offset, x-offset:x + w + offset]
    # If the cropped image is not empty
    if np.any(img_crop):
      # Resize the cropped image to match the image size
      img_crop = cv2.resize(img_crop, (img_size, img_size))
      # Paste the cropped image onto the white image
      img_white[0:img_size, 0:img_size] = img_crop
      
      # Predict the label of the white image using a custom function from another module
      label = predicted_label(img_white)

      # Draw a rectangle and put text on the output frame to show the label
      cv2.rectangle(img_output, (x+30, y-30), (x + 100, y - 85), (255, 0, 255), cv2.FILLED)
      cv2.putText(img_output, label, (x+50, y-50), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
      # Draw another rectangle around the cropped area on the output frame
      cv2.rectangle(img_output, (x-offset + 20, y-offset + 20), (x + w+offset - 20, y + h + offset - 20), (255, 0, 255), 4)
      
  # Show the output frame in a window named "Original"
  cv2.imshow("Original", img_output)


  # Wait for a key press and check if it is 'q'
  key = cv2.waitKey(1) & 0xFF
  if key == ord('q'):
    # Break out of the loop and stop capturing frames
    break

# Release the webcam and close all windows
cap.release()
cv2.destroyAllWindows()

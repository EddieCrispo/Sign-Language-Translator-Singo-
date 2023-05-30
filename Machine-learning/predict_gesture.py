# Mengimpor modul cv2
import cv2
import mediapipe as mp
import numpy as np
from predict_label import predicted_label

mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands
mp_drawing_styles = mp.solutions.drawing_styles

detector = mp_hands.Hands(
  max_num_hands=1, 
  static_image_mode=True,
  min_detection_confidence=0.2, 
  min_tracking_confidence=0.2
)

landmark_spec = mp_drawing.DrawingSpec(color=(0, 0, 0))
connection_spec = mp_drawing.DrawingSpec(color=(255, 255, 255))

img_size = 224
offset = 50

cap = cv2.VideoCapture(0)
while True:
  ret, img = cap.read()
  img_output = img.copy()
  results = detector.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

  if results.multi_hand_landmarks:
    hand_landmarks = results.multi_hand_landmarks[0]
    mp.solutions.drawing_utils.draw_landmarks(
      img, 
      hand_landmarks, 
      mp_hands.HAND_CONNECTIONS, 
      landmark_drawing_spec=landmark_spec,
      connection_drawing_spec=connection_spec
    )

    points = []
    for data_point in hand_landmarks.landmark:
      points.append([data_point.x * img.shape[1], data_point.y * img.shape[0]])
    x,y,w,h = cv2.boundingRect(np.array(points).astype('float32'))

    img_white = np.ones((img_size, img_size, 3), np.uint8)*255
    img_crop = img[y-offset:y + h+offset, x-offset:x + w + offset]
    if np.any(img_crop):
      img_crop = cv2.resize(img_crop, (img_size, img_size))
      img_white[0:img_size, 0:img_size] = img_crop
      label = predicted_label(img_white)

      # cv2.imshow("img_white", img_white)
      cv2.rectangle(img_output, (x+30, y-30), (x + 100, y - 85), (255, 0, 255), cv2.FILLED)
      cv2.putText(img_output, label, (x+50, y-50), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
      cv2.rectangle(img_output, (x-offset + 20, y-offset + 20), (x + w+offset - 20, y + h + offset - 20), (255, 0, 255), 4)

  cv2.imshow("Original", img_output)

  key = cv2.waitKey(1) & 0xFF
  if key == ord('q'):
    break

cap.release()
cv2.destroyAllWindows()
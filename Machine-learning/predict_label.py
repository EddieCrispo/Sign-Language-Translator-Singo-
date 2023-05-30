import cv2
import numpy as np
import tensorflow as tf

CATEGORIES = [chr(i + 65) for i in range(26)]
model = tf.keras.models.load_model('./result/best_model.h5')
def predicted_label(input_image):
  img_rescale = (input_image * 1.0) / 255.0
  img_resize = cv2.resize(img_rescale, (224, 224))
  img_resize_expand = img_resize.reshape(1, *img_resize.shape)
  my_prediction = model.predict(img_resize_expand)
  my_label = CATEGORIES[np.argmax(my_prediction)]
  return my_label
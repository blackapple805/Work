import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'      # hide info/warning spam
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'     # silence the oneDNN notice

import sys
import numpy as np
import tensorflow as tf
from PIL import Image, ImageOps


def preprocess(path):
    img = Image.open(path).convert('L')      # grayscale
    img = ImageOps.invert(img)               # MNIST is white-on-black; photos are usually black-on-white
    img = img.resize((28, 28))
    arr = np.array(img) / 255.0
    return arr[None, ..., None]              # shape (1, 28, 28, 1)


def main():
    if len(sys.argv) < 2:
        print("Usage: python predict.py <image_path>")
        print("Tip: run 'python evaluate.py' first to drop test images into samples/")
        sys.exit(1)

    path = sys.argv[1]
    if not os.path.exists(path):                  # clean message instead of a traceback
        print(f"Error: file not found -> {path}")
        print("Put a digit image in the samples/ folder first, or run")
        print("'python evaluate.py' to auto-generate a few sample digits there.")
        sys.exit(1)

    model = tf.keras.models.load_model('saved_model/mnist_cnn.keras')
    probs = model.predict(preprocess(path), verbose=0)[0]

    digit = int(np.argmax(probs))
    print(f"\nPredicted: {digit}  ({100*probs[digit]:.1f}% confident)\n")

    # show the top 3 guesses, which is useful when the model is unsure
    top3 = np.argsort(probs)[::-1][:3]
    print("Top 3:")
    for rank, d in enumerate(top3, 1):
        print(f"  {rank}. digit {d} -> {100*probs[d]:.1f}%")


if __name__ == '__main__':
    main()
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'      # hide info/warning spam
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'     # silence the oneDNN notice

import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from PIL import Image

(_, _), (test_images, test_labels) = tf.keras.datasets.mnist.load_data()
test_images = (test_images / 255.0)[..., None]

model = tf.keras.models.load_model('saved_model/mnist_cnn.keras')
predictions = model.predict(test_images, verbose=0)
pred_labels = np.argmax(predictions, axis=1)


# --- visualization 1: the 15-image prediction grid ---
def plot_image(i):
    plt.grid(False); plt.xticks([]); plt.yticks([])
    plt.imshow(test_images[i].squeeze(), cmap=plt.cm.binary)
    predicted = pred_labels[i]
    color = 'blue' if predicted == test_labels[i] else 'red'
    plt.xlabel(f"Pred: {predicted} ({100*np.max(predictions[i]):.1f}%)\n"
               f"Actual: {test_labels[i]}", color=color)

plt.figure(figsize=(15, 5))
for i in range(15):
    plt.subplot(3, 5, i + 1); plot_image(i)
plt.tight_layout()
plt.savefig('mnist_predictions.png', dpi=110)
plt.close()
print("Saved mnist_predictions.png")


# --- visualization 2: confusion matrix (which digits get mixed up) ---
cm = np.zeros((10, 10), dtype=int)
for true, pred in zip(test_labels, pred_labels):
    cm[true][pred] += 1

plt.figure(figsize=(8, 7))
plt.imshow(cm, cmap='Blues')
plt.colorbar(label='count')
plt.xlabel('Predicted'); plt.ylabel('Actual')
plt.title('Confusion matrix (test set)')
plt.xticks(range(10)); plt.yticks(range(10))
for i in range(10):
    for j in range(10):
        plt.text(j, i, cm[i][j], ha='center', va='center',
                 color='white' if cm[i][j] > cm.max() / 2 else 'black',
                 fontsize=8)
plt.tight_layout()
plt.savefig('confusion_matrix.png', dpi=110)
plt.close()
print("Saved confusion_matrix.png")


# --- convenience: drop a few real MNIST digits into samples/ ---
# so predict.py has something to run on without needing Paint.
os.makedirs('samples', exist_ok=True)
(_, _), (raw_test, raw_labels) = tf.keras.datasets.mnist.load_data()
for n in range(3):
    # invert to black-on-white, the way a real photo/scan looks.
    # (predict.py inverts again internally to match MNIST.)
    img = Image.fromarray(255 - raw_test[n])
    fname = f"samples/sample_{raw_labels[n]}.png"
    img.save(fname)
    print(f"Saved {fname}  (a real '{raw_labels[n]}' you can test predict.py on)")

# overall accuracy summary
acc = (pred_labels == test_labels).mean()
print(f"\nOverall test accuracy: {acc:.4f}  ({(pred_labels == test_labels).sum()}/{len(test_labels)} correct)")
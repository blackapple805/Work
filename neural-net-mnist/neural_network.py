import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import matplotlib.pyplot as plt

# Load and preprocess the dataset
mnist = tf.keras.datasets.mnist
(train_images, train_labels), (test_images, test_labels) = mnist.load_data()
train_images = train_images / 255.0
test_images = test_images / 255.0

# Build the neural network model
model = models.Sequential([
    layers.Input(shape=(28, 28)),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(10, activation='softmax')
])

# Compile the model
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Train the model
model.fit(train_images, train_labels, epochs=5)

# Evaluate the model
test_loss, test_acc = model.evaluate(test_images, test_labels, verbose=2)
print('\nTest accuracy:', test_acc)

# Make predictions on the test images
predictions = model.predict(test_images)

# Function to plot the image along with predicted and actual labels
def plot_image(i, predictions_array, true_label, img):
    predictions_array, true_label, img = predictions_array[i], true_label[i], img[i]
    plt.grid(False)
    plt.xticks([])
    plt.yticks([])

    plt.imshow(img, cmap=plt.cm.binary)

    predicted_label = np.argmax(predictions_array)
    if predicted_label == true_label:
        color = 'blue'  # Correct prediction
    else:
        color = 'red'   # Incorrect prediction

    plt.xlabel(f"Predicted: {predicted_label} ({100*np.max(predictions_array):.2f}%)\nActual: {true_label}", color=color)

# Plot the first 15 test images with their predictions
num_images = 15
plt.figure(figsize=(15, 5))
for i in range(num_images):
    plt.subplot(3, 5, i+1)
    plot_image(i, predictions, test_labels, test_images)
plt.tight_layout()

# Save the figure as an image file instead of displaying it
plt.savefig('mnist_predictions.png')

print("\nThe plot has been saved as 'mnist_predictions.png' in your current directory.")

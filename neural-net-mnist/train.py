import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'      # hide info/warning spam
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'     # silence the oneDNN notice

import tensorflow as tf
from tensorflow.keras import layers, models, callbacks
import matplotlib.pyplot as plt

# --- THERMAL SAFETY: cap CPU usage so the machine doesn't overheat ---
# By default TensorFlow uses every core at 100%, which can thermal-shutdown
# a laptop. This leaves headroom. Lower these numbers if it still runs hot;
# raise them (or delete the block) on a machine with good cooling.
NUM_THREADS = 4
tf.config.threading.set_intra_op_parallelism_threads(NUM_THREADS)
tf.config.threading.set_inter_op_parallelism_threads(2)


def build_model():
    model = models.Sequential([
        layers.Input(shape=(28, 28, 1)),

        # light augmentation -> helps generalize to your own handwriting
        layers.RandomRotation(0.06),
        layers.RandomZoom(0.08),

        # single conv per block keeps compute (and heat) down
        layers.Conv2D(32, 3, activation='relu'),
        layers.MaxPooling2D(),
        layers.Conv2D(64, 3, activation='relu'),
        layers.MaxPooling2D(),

        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(10, activation='softmax')
    ])
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])
    return model


def main():
    (train_images, train_labels), (test_images, test_labels) = \
        tf.keras.datasets.mnist.load_data()

    train_images = (train_images / 255.0)[..., None]
    test_images  = (test_images  / 255.0)[..., None]

    model = build_model()

    # stop early once validation accuracy stops improving (usually ~epoch 6),
    # and keep the best weights. Cuts training time roughly in half.
    early_stop = callbacks.EarlyStopping(
        monitor='val_accuracy', patience=3,
        restore_best_weights=True, verbose=1)

    history = model.fit(train_images, train_labels,
                        epochs=15,                # ceiling; early_stop usually ends sooner
                        batch_size=128,           # larger batch = fewer steps = faster
                        validation_split=0.1,
                        callbacks=[early_stop])

    test_loss, test_acc = model.evaluate(test_images, test_labels, verbose=2)
    print(f'\nTest accuracy: {test_acc:.4f}')

    os.makedirs('saved_model', exist_ok=True)
    model.save('saved_model/mnist_cnn.keras')
    print("Model saved to saved_model/mnist_cnn.keras")

    # training history curves
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    ax1.plot(history.history['accuracy'], label='train')
    ax1.plot(history.history['val_accuracy'], label='validation')
    ax1.set_title('Accuracy'); ax1.set_xlabel('epoch'); ax1.legend(); ax1.grid(True, alpha=0.3)
    ax2.plot(history.history['loss'], label='train')
    ax2.plot(history.history['val_loss'], label='validation')
    ax2.set_title('Loss'); ax2.set_xlabel('epoch'); ax2.legend(); ax2.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig('training_history.png', dpi=110)
    print("Saved training_history.png")


if __name__ == '__main__':
    main()
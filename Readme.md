# 📚 [ExamGuard: AI-Powered Cheat Detection](https://mushxoxo.github.io/Cheat-Detector/)

Welcome to [**ExamGuard**](https://mushxoxo.github.io/Cheat-Detector/), a smart proctoring system designed to detect cheating during online or offline exams using AI. This repository includes model training code, web integration, and ONNX export support to deploy AI models efficiently.

---

## 📦 Dataset Used

We used the **"Cheating Scenario Dataset in Online Exam"** from Mendeley Data.

**🔗 Dataset Link:** [https://data.mendeley.com/datasets/6v6zzy3nty/1](https://data.mendeley.com/datasets/6v6zzy3nty/1)

### 🧾 Dataset Structure

```
Cheat Database/
├── Scenario_1/        # Cheating example
├── Scenario_2/        # Cheating example
├── Scenario_3/        # Non-cheating example
├── Scenario_4/        # Non-cheating example
└── ...
```

Each folder contains image frames extracted from short video clips. Labels were assigned manually as:

- `1` for cheating
- `0` for not cheating

---

## 🔧 Installation & Setup

### 🐍 Requirements

Install Python dependencies using pip:

```bash
pip install -r requirements.txt
```

### 📝 `requirements.txt`

```
numpy
opencv-python
matplotlib
scikit-learn
onnx
onnxruntime
tensorflow
tensorflowjs
```

---

## 🧠 Model Training

1. **Preprocessing**

   - Organize dataset into `train/` and `test/` folders based on identity (to avoid data leakage).
   - Resize and normalize images.

2. **Training**

   - We used **MobileNetV2** with transfer learning.
   - Applied data augmentation for generalization.

```python
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
```

3. **Saving the Model**

```python
model.save("cheat_detector_model")
```

4. **Export to ONNX**

```bash
python -m tf2onnx.convert --saved-model cheat_detector_model --output model.onnx
```

---

## 🌐 Website Integration

The frontend includes an exam UI with cheat detection:

- Users must **grant camera and mic access**.
- App tracks **fullscreen**, **tab switching**, **blur events**, and **AI-based webcam detection**.
- If cheating is detected, a **warning is logged**.
- Optionally, a **gimmick taser trigger** can be added 😄 (only for fun, not real usage).

### 📂 Web Folder Structure

```
web/
├── index.html
├── index1.html
├── index2.html
├── script.js
├── styles.css
└── model.onnx
```

### 👨‍💻 Running the Web App

Use a simple HTTP server:

```bash
cd docs
python -m http.server 8080
```

Then open: [http://localhost:8080](http://localhost:8080)

---

## 🛠️ Tech Stack

| Layer       | Technology               |
| ----------- | ------------------------ |
| Model       | TensorFlow + MobileNetV2 |
| Export      | ONNX                     |
| Web Runtime | ONNX.js / TensorFlow\.js |
| Frontend    | HTML, CSS, JavaScript    |
| Backend API | Flask (Optional)         |
| Dataset     | Mendeley (Scenarios)     |

---

## 📌 Features

- 📸 Real-time webcam monitoring
- 🔒 Fullscreen & tab-switch detection
- 🚨 AI-powered cheat detection
- 📄 Warning log per session
- ⚡ Optional taser gimmick trigger (To be added)

---

## 💡 Future Improvements

- Integrate audio-based cheating detection (e.g. whispering)
- Facial emotion recognition
- Real-time cloud logging
- User authentication and secure session management

---

## 🤝 Contributing

Feel free to fork this project and contribute! Pull requests are welcome.

---

## 📜 License

MIT License. See `LICENSE` file for details.

---

## 👨‍🔬 Maintainer

Built with ❤️ during a Hackathon by [mushxoxo].

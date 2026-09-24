---
title: "AI Assistive Camera with Email Sender"
category: "Python | Computer Vision | Streamlit"
group: "project"
period: "Robbinsville High School CS Fair | 2024"
summary: "A Python and Streamlit assistive-camera workflow used successfully by **200+ users** at the 2024 event."
date: 2024-05-01
external: "https://github.com/aarushmane/AI-Assistive-Camera-with-Email-Sender"
media:
  - src: "media/AICam1.JPG"
    alt: "AI Assistive Camera project display"
    caption: "A live demonstration of the assistive-camera workflow at the 2024 CS Fair."
  - src: "media/AICam2.jpg"
    alt: "Students using the AI Assistive Camera at the CS Fair"
    caption: "The project in use during the event, where it served more than 200 participants."
---

This 2024 Robbinsville High School CS Fair project combines a live webcam interface, computer vision, and email automation. The application waits for a face and eyes before it allows a picture to be captured. It then emails the image to a configured recipient.

## Technical implementation

- **Interactive application:** Built a Streamlit interface with live camera output, a capture button, sidebar controls, status text, and email fields.
- **Video capture:** Used OpenCV to read webcam frames and display the processed result in the browser interface.
- **Image preprocessing:** Converted frames from BGR to grayscale and applied a bilateral filter to reduce noise while preserving edges.
- **Hierarchical detection:** Used a frontal-face Haar cascade to find face regions, then passed each face ROI to a separate eye cascade.
- **Capture gating:** Required at least two detected eyes before marking the camera ready. This reduced premature captures.
- **Visual feedback:** Drew face boxes and displayed “Eye detected,” “No eyes detected,” and “No face detected” during the live loop.
- **Image controls:** Added contrast and brightness sliders with `cv2.addWeighted`, plus an optional grayscale display mode.
- **Snapshot pipeline:** Captured the selected frame, applied the image settings, wrote `savedImg.jpg`, and read it as binary data.
- **Email delivery:** Built a Python `EmailMessage`, attached the image with its MIME subtype, and sent it through Gmail SMTP over SSL with `smtplib`.
- **Dependencies:** Used Python, Streamlit, OpenCV, Pillow, NumPy, `email`, `ssl`, `smtplib`, and Haar cascade XML classifiers.

## User workflow

1. Open the Streamlit camera interface and set brightness, contrast, and grayscale preferences.
2. Enter the sender, app-password credential, recipient, subject, and message body.
3. Wait for the detection loop to confirm a face and at least two eyes.
4. Select the capture action after the interface reports that eyes are detected.
5. Send the adjusted image as an email attachment through the configured Gmail account.

## Engineering focus

The project connected real-time sensing, image preprocessing, hierarchical detection, user confirmation, file handling, and secure network delivery in one application. It also showed the detection state, so users knew why the camera was or was not ready.

## Project outcome

The project was developed for the 2024 Robbinsville High School CS Fair and was used successfully by 200+ people at the event. This deployment gave me hands-on experience integrating OpenCV detection, a browser-based Python application, image controls, and SMTP email automation.

## Event outcome

- **200+ users served:** More than 200 participants used the camera workflow during the event.
- **End-to-end validation:** Users completed the detection flow, captured images, and triggered email delivery.
- **Practical usability:** Repeated live use showed the value of clear status feedback and simple controls.

[View the project on GitHub](https://github.com/aarushmane/AI-Assistive-Camera-with-Email-Sender)
